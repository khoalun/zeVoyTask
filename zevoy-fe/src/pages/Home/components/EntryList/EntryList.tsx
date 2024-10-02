import {
  Card,
  Typography,
  Dialog,
  Button,
  PaginationBar,
  LoadingSpinner,
} from "@components";
import { FormBudgetEntry } from "../FormBudgetEntry";
import { useBool, useDeleteBudgetEntry, useGetBudgetEntries } from "@hooks";
import { BudgetEntry, Currency, getCurrencySymbol } from "@models";
import { EntryDisplay } from "../EntryDisplay";
import { useState } from "react";

export interface EntryListProps {
  budgetId: string;
  currency: Currency;
}

export function EntryList({ budgetId, currency }: EntryListProps) {
  const openCreateEntry = useBool();

  const [paginationOffset, setPaginationOffset] = useState(0);

  const { data: entries, isFetching } = useGetBudgetEntries({
    budgetId,
    offset: paginationOffset,
  });

  const { mutateAsync: deleteEntryAction, isPending: isDeleting } =
    useDeleteBudgetEntry();

  const currencySymbol = getCurrencySymbol(currency);

  const [editEntry, setEditEntry] = useState<BudgetEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<BudgetEntry | null>(null);

  return (
    <div className="max-w-[800px] mx-auto">
      <Card>
        <div className="flex justify-between">
          <Typography as="h3" textStyle="heading2">
            Recent
          </Typography>

          <Dialog
            open={openCreateEntry.value}
            onOpenChange={openCreateEntry.setValue}
            trigger={<Button colorStyle="primary">Create Entry</Button>}
            headerTitle="Create Entry"
          >
            <FormBudgetEntry
              budgetId={budgetId}
              onSuccessfulSubmit={openCreateEntry.setFalse}
            />
          </Dialog>
        </div>

        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
              <LoadingSpinner />
            </div>
          )}
          <div className="mt-4 flex flex-col gap-3">
            {entries?.data?.map((entry) => (
              <EntryDisplay
                key={entry.id}
                type={entry.type}
                amount={entry.amount}
                description={entry.description}
                groupType={entry.group_type}
                currency={currencySymbol}
                date={new Date(entry.created_at).toLocaleDateString()}
                onEdit={() => setEditEntry(entry)}
                onDelete={() => setDeleteEntry(entry)}
              />
            ))}
          </div>
          {entries?.meta && entries.meta.total > entries.meta.limit && (
            <div className="mt-4">
              <PaginationBar
                total={entries.meta.total}
                limit={entries.meta.limit}
                offset={entries.meta.offset}
                onPageChange={(offset) => {
                  setPaginationOffset(offset);
                }}
              />
            </div>
          )}
        </div>
      </Card>

      {editEntry && (
        <Dialog
          open={!!editEntry}
          onOpenChange={() => {
            setEditEntry(null);
          }}
          headerTitle="Edit Entry"
        >
          <FormBudgetEntry
            mode="edit"
            budgetId={budgetId}
            editId={editEntry.id}
            defaultValues={{
              type: editEntry.type,
              groupType: editEntry.group_type.toString(),
              amount: editEntry.amount,
              description: editEntry.description,
            }}
            onSuccessfulSubmit={() => {
              setEditEntry(null);
            }}
          />
        </Dialog>
      )}

      {deleteEntry && (
        <Dialog
          open={!!deleteEntry}
          onOpenChange={() => {
            if (isDeleting) return;
            setDeleteEntry(null);
          }}
          headerTitle="Delete Entry"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                colorStyle="danger"
                onClick={async () => {
                  await deleteEntryAction({
                    budgetId,
                    entryId: deleteEntry.id,
                  });
                  setDeleteEntry(null);
                }}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                disabled={isDeleting}
                onClick={() => setDeleteEntry(null)}
              >
                Cancel
              </Button>
            </div>
          }
        >
          <Typography>Are you sure you want to delete this entry?</Typography>
        </Dialog>
      )}
    </div>
  );
}
