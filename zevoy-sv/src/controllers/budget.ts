import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../pg";
import { Budget, BudgetEntryType, Currency } from "../models";
import { Pool } from "pg";
import z from "zod";

const budgetCreateSchema = z
  .object({
    amount: z.coerce
      .number()
      .positive()
      .nonnegative()
      .min(1)
      .refine(
        (value) => {
          return Number.isInteger(value * 100);
        },
        {
          message: "Number must have at most 2 decimal places",
        },
      )
      .optional(),
    currency: z.nativeEnum(Currency).optional(),
    usePrevious: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.usePrevious) {
        return true;
      } else {
        return data.amount !== undefined && data.currency !== undefined;
      }
    },
    {
      message: "amount and currency are required when usePrevious is false",
      path: ["amount", "currency"],
    },
  );

type BudgetCreateSchema = z.infer<typeof budgetCreateSchema>;

const entryCreateSchema = z.object({
  type: z.number(),
  groupType: z.number(),
  amount: z.coerce.number().positive().nonnegative().min(1),
  description: z.string().max(255).optional(),
});

class BudgetModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getCurrent(userId: string): Promise<Budget | undefined> {
    //   `SELECT * FROM budgets WHERE user_id = $1
    //   and (DATE_TRUNC('month', month) = DATE_TRUNC('month', CURRENT_DATE) OR month IS NULL)
    //   ORDER BY month, month IS NULL LIMIT 1;
    // `,
    const result = await this.pool.query(
      `SELECT * FROM budgets WHERE user_id = $1 
        ORDER BY month desc LIMIT 1;
      `,
      [userId],
    );

    return result.rows[0];
  }

  async create({
    amount,
    currency,
    userId,
    month,
  }: BudgetCreateSchema & {
    userId: string;
    month?: Date;
  }): Promise<Budget | undefined> {
    const wMonth = month || new Date();
    console.log(userId, wMonth, amount, currency);
    const r = await pool.query(
      ` INSERT INTO budgets (user_id, month, start, currency)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`,
      [userId, wMonth, amount, currency],
    );

    return r.rows[0];
  }

  async getDetails(id: string): Promise<Budget | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM budgets WHERE id = $1;`,
      [id],
    );

    return result.rows[0];
  }

  async getStatistics(id: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    start: number;
  }> {
    const r = await pool.query(
      `SELECT SUM(CASE WHEN type = $1 THEN amount ELSE 0 END) AS total_income, SUM(CASE WHEN type = $2 THEN amount ELSE 0 END) AS total_expense
  FROM budgetEntries WHERE budget_id = $3;`,
      [BudgetEntryType.INCOME, BudgetEntryType.EXPENSE, id],
    );

    const budget = await this.getDetails(id);

    const start = budget?.start || 0;
    const totalIncome = r.rows[0].total_income || 0;
    const totalExpense = r.rows[0].total_expense || 0;
    const balance = totalIncome + start - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      start,
    };
  }
}

export async function budgetController(fastify: FastifyInstance) {
  const budgetModel = new BudgetModel(pool);

  fastify.get(
    "/current",
    {
      preHandler: [fastify.authenticate],
    },
    async function (request: FastifyRequest, _reply: FastifyReply) {
      const requestUser = request.user;

      const result = await budgetModel.getCurrent(requestUser.id);

      return { data: result };
    },
  );

  fastify.post(
    "/",
    {
      schema: { body: budgetCreateSchema },
      preHandler: [fastify.authenticate],
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const requestUser = request.user;
      const currentMonth = new Date().getMonth() + 1;

      const current = await budgetModel.getCurrent(requestUser.id);

      if (current) {
        const monthCreated = new Date(current.month).getMonth() + 1;
        console.log(currentMonth, monthCreated);
        if (currentMonth === monthCreated) {
          return reply
            .status(400)
            .send({ message: "Budget already created for this month" });
        }
      }

      const { amount, currency, usePrevious } = request.body as {
        amount: number;
        currency: Currency;
        usePrevious?: boolean;
      };

      let newAmount = amount;
      let newCurrency = currency;

      if (usePrevious) {
        if (!current) {
          return reply
            .status(400)
            .send({ message: "No previous budget to use" });
        }
        const stats = await budgetModel.getStatistics(current.id);
        newAmount = stats.balance;
        newCurrency = current.currency;
      }

      const result = await budgetModel.create({
        amount: newAmount,
        currency: newCurrency,
        userId: requestUser.id,
      });

      return { data: result };
    },
  );

  fastify.post(
    "/:id/entries",
    {
      schema: { body: entryCreateSchema },
      preHandler: [fastify.authenticate],
    },
    async function (
      request: FastifyRequest<{ Params: { id: string } }>,
      _reply: FastifyReply,
    ) {
      const id = request.params.id;

      const { amount, type, groupType, description } = request.body as {
        amount: number;
        type: number;
        groupType: number;
        description: string;
      };

      const r = await pool.query(
        `INSERT INTO budgetEntries (description, amount, type, group_type, budget_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
        [description, amount, type, groupType, id],
      );

      return { data: r.rows[0] };
    },
  );

  fastify.put(
    "/:id/entries/:entryId",
    {
      schema: { body: entryCreateSchema },
      preHandler: [fastify.authenticate],
    },
    async function (
      request: FastifyRequest<{
        Params: { id: string; entryId: string };
      }>,
      reply: FastifyReply,
    ) {
      const id = request.params.id;
      const entryId = request.params.entryId;

      const budget = await budgetModel.getDetails(id);

      if (!budget) {
        return reply.status(404).send({ message: "Budget not found" });
      }

      const { amount, type, groupType, description } = request.body as {
        amount: number;
        type: number;
        groupType: number;
        description: string;
      };

      const r = await pool.query(
        `UPDATE budgetEntries SET description = $1, amount = $2, type = $3, group_type = $4
        WHERE id = $5
        RETURNING *;`,
        [description, amount, type, groupType, entryId],
      );

      return { data: r.rows[0] };
    },
  );

  fastify.get(
    "/:id/entries",
    {
      preHandler: [fastify.authenticate],
      schema: {},
    },
    async function (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: {
          limit?: number;
          offset?: number;
        };
      }>,
      _reply: FastifyReply,
    ) {
      const id = request.params.id;
      const limit = request.query.limit
        ? Math.max(Math.min(request.query.limit, 100), 10)
        : 10;
      const offset = request.query.offset || 0;

      const r = await pool.query(
        `SELECT * FROM budgetEntries WHERE budget_id = $1 
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;`,
        [id, limit, offset],
      );

      const total = await pool.query(
        `SELECT COUNT(*) FROM budgetEntries WHERE budget_id = $1;`,
        [id],
      );

      return {
        data: r.rows,
        meta: { total: parseInt(total.rows[0].count), limit, offset },
      };
    },
  );

  fastify.delete(
    "/:id/entries/:entryId",
    {
      preHandler: [fastify.authenticate],
    },
    async function (
      request: FastifyRequest<{
        Params: { id: string; entryId: string };
      }>,
      reply: FastifyReply,
    ) {
      const id = request.params.id;
      const entryId = request.params.entryId;

      const r = await pool.query(
        `DELETE FROM budgetEntries WHERE id = $1 AND budget_id = $2
        RETURNING *;`,
        [entryId, id],
      );

      if (r.rowCount === 0) {
        return reply.status(404).send({ message: "Entry not found" });
      }

      return { data: r.rows[0] };
    },
  );

  fastify.get(
    "/:id/stats",
    {
      preHandler: [fastify.authenticate],
    },
    async function (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) {
      const id = request.params.id;

      const budget = await budgetModel.getDetails(id);

      if (!budget) {
        return reply.status(404).send({ message: "Budget not found" });
      }

      const { totalIncome, totalExpense, balance, start } =
        await budgetModel.getStatistics(id);

      return {
        data: {
          totalIncome,
          totalExpense,
          balance,
          start,
        },
      };
    },
  );
}
