import { DescribeBudgetsResponse, Budget, Spend } from "aws-sdk/clients/budgets";

export type SlackBlocks = {
  blocks: Blocks;
};
type Blocks = Section[];
type Section = {
  type: "section";
  text: {
    type: "mrkdwn";
    text: string;
  };
};

export function mapBudgetsToSlackBlocks(budgets: DescribeBudgetsResponse): SlackBlocks {
  const blocks = new Array<Section>();
  const { CalculatedSpend } = getMonthlyCostSpent(budgets);
  const actual = formatSpend(CalculatedSpend?.ActualSpend);
  const forecast = formatSpend(CalculatedSpend?.ForecastedSpend);
  const message = `*実績値*: ${actual}\n*予測値*: ${forecast}`;
  const section: Section = {
    type: "section" as const,
    text: {
      type: "mrkdwn" as const,
      text: message,
    },
  };
  blocks.push(section);
  return { blocks };
}

function getMonthlyCostSpent(budgets: DescribeBudgetsResponse): Budget {
  if (!budgets.Budgets) {
    throw new Error("no budget");
  }
  const monthlyCost = budgets.Budgets.find((budget) => {
    return budget.BudgetType === "COST" && budget.TimeUnit === "MONTHLY";
  });
  if (!monthlyCost) {
    throw new Error("no monthly cost");
  }
  return monthlyCost;
}

function formatSpend(spend?: Spend): string {
  if (!spend) {
    return "not get spend";
  }
  const { Amount, Unit } = spend;
  return `${Unit} ${Amount}`;
}
