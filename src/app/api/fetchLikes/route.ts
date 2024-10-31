import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/client';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // URL から userId を取得
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: 'ユーザーIDが提供されていません。' },
      { status: 400 }
    );
  }

  try {
    const favorites = await prisma.userBook.findMany({
      where: { userId: userId },
      select: { bookId: true },
    });

    const favoriteBookIds = favorites.map((favorite) => favorite.bookId);

    return NextResponse.json(favoriteBookIds);
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    return NextResponse.json(
      { error: 'お気に入りの取得に失敗しました。' },
      { status: 500 }
    );
  }
}
