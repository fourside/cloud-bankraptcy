import fetch from "node-fetch";
import { SlackBlocks } from "./mapBudgetsToSlackBlocks";

export async function sendToSlack(webhookUrl: string, slackMessage: SlackBlocks): Promise<unknown> {
  const respose = await fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify(slackMessage),
    headers: { "Content-Type": "application/json" },
  });
  return await respose.json();
}
