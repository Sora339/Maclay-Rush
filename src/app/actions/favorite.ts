'use server';

import { prisma } from "../../../prisma/client";


// サーバーアクションでお気に入りをトグルする関数
export async function toggleFavorite(userId: string, bookId: string, bookData: any) {
  try {
    // 1. Bookテーブルに指定されたbookIdが存在するか確認
    let book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    // 2. 本が存在しない場合はBookテーブルに登録
    if (!book) {
      book = await prisma.book.create({
        data: {
          id: bookId,
          thumbnailURL: bookData.thumbnailURL,
          saleability: bookData.saleability,
          buyLink: bookData.buyLink,
          description: bookData.description,
        },
      });
    }

    // 3. 既にUserBookに登録されているか確認
    const existingFavorite = await prisma.userBook.findFirst({
      where: { userid: userId, bookid: bookId },
    });

    if (existingFavorite) {
      // 4. お気に入りを解除（UserBookから削除）
      await prisma.userBook.delete({
        where: { id: existingFavorite.id },
      });
      return { liked: false };
    } else {
      // 5. UserBookに登録
      await prisma.userBook.create({
        data: {
          userid: userId,
          bookid: bookId,
          content: 'お気に入り登録',
          timestamo: new Date(),
        },
      });
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { error: '内部サーバーエラーが発生しました。' };
  }
}
