import { getAccount } from "./aws-sts";
import { getBudgets } from "./aws-budget";
import { sendToSlack } from "./slack-client";
import { mapBudgetsToSlackBlocks } from "./mapBudgetsToSlackBlocks";

export async function handler(event: unknown): Promise<void> {
  console.log(JSON.stringify(event));
  try {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error("not set env `SLACK_WEBHOOK_URL`");
    }
    const accountId = await getAccount();
    const budgets = await getBudgets(accountId);
    const slackMessage = mapBudgetsToSlackBlocks(budgets);
    const respose = await sendToSlack(slackWebhookUrl, slackMessage);
    console.log("slack response", respose);
  } catch (e) {
    console.error(e);
  }
}
