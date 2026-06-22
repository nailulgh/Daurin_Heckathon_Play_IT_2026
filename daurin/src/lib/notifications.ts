import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  referenceId?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        referenceId,
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
