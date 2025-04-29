import webPush from "web-push";

webPush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendNotification(subscription: any, article: any) {
  try {
    await webPush.sendNotification(subscription, JSON.stringify({
      title: article.title,
      body: `${article.rewritten.slice(0, 100)}... (${article.sentiment})`,
      url: `/article/${article._id}`,
    }));
  } catch (error) {
    console.error("Notification error:", error);
  }
}