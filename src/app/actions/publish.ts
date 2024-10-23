'use server';

import { prisma } from "../../../prisma/client";

// 公開設定の取得
export async function getPublishStatus(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { public: true },
    });

    if (user) {
      return user.public;
    } else {
      throw new Error("ユーザーが見つかりません");
    }
  } catch (error) {
    console.error("Error fetching publish status:", error);
    return null; // Handle error by returning null or an appropriate fallback.
  }
}

// 公開設定のトグル
export async function togglePublish(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { public: true },
    });

    if (user) {
      const newStatus = !user.public;

      await prisma.user.update({
        where: { id: userId },
        data: { public: newStatus },
      });

      return newStatus;
    } else {
      throw new Error("ユーザーが見つかりません");
    }
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return null; // Handle error gracefully.
  }
}
