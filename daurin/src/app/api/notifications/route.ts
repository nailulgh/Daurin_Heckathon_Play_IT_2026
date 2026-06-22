import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    // Ambil notifikasi milik user, urutkan dari yang terbaru
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit 50 notifikasi terakhir
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const body = await req.json();

    if (body.action === "MARK_ALL_READ") {
      // Tandai semua notifikasi milik user ini sebagai telah dibaca
      const update = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return NextResponse.json({ success: true, count: update.count });
    }

    if (body.notificationId) {
      // Tandai satu notifikasi spesifik
      const update = await prisma.notification.update({
        where: { id: body.notificationId, userId },
        data: { isRead: true }
      });
      return NextResponse.json(update);
    }

    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
