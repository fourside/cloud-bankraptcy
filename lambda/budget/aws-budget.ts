import Budgets from "aws-sdk/clients/budgets";

const budgets = new Budgets();

export async function getBudgets(accountId: string): Promise<Budgets.DescribeBudgetsResponse> {
  return new Promise((resolve, reject) => {
    const params = {
      AccountId: accountId,
    };
    budgets.describeBudgets(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
