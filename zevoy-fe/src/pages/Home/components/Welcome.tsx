import { Card, Typography, Button } from "@components";
import { useState } from "react";
import { FormCreateBudget } from "./FormCreateBudget";

export function Welcome() {
  const [step, setStep] = useState(1);

  function handleGetStarted() {
    setStep(2);
  }

  if (step === 2) {
    return (
      <div className="max-w-[500px] w-full mx-auto">
        <Card>
          <FormCreateBudget />
        </Card>
      </div>
    );
  }

  return (
    <Card className="max-w-[700px] w-full mx-auto">
      <div className="text-center">
        <Typography as="h1" textStyle="heading">
          Welcome to TKO Budget
        </Typography>
        <Typography className="mt-2">
          TKO Budget is a simple budgeting tool to help you manage your
          finances.
        </Typography>
        <Typography className="mt-2">
          Get started by creating a budget plan.
        </Typography>
        <Button
          className="mt-6"
          colorStyle="primary"
          onClick={handleGetStarted}
        >
          Get started
        </Button>
      </div>
    </Card>
  );
}
