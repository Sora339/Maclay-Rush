'use server';

import { prisma } from "../../../prisma/client";

// サーバーアクションで公開設定をトグルする関数
export async function togglePublish(userId: string) {
  try {
    // 1. ユーザーの公開状態を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { public: true }, // public プロパティのみ取得
    });

    if (user) {
      const newStatus = !user.public; // 現在の状態を反転

      // 2. 状態を反転して更新
      await prisma.user.update({
        where: { id: userId },
        data: { public: newStatus },
      });

      return newStatus; // 新しい公開状態を返す
    } else {
      throw new Error('ユーザーが見つかりません');
    }
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return { error: '内部サーバーエラーが発生しました。' };
  }
}
