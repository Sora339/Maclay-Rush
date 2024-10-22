import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';

// お気に入り本IDを取得するAPI
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const favorites = await prisma.userBook.findMany({
      where: { userid: userId },
      select: { bookid: true },
    });

    const favoriteBookIds = favorites.map((favorite) => favorite.bookid);

    return NextResponse.json(favoriteBookIds);
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    return NextResponse.json(
      { error: 'お気に入りの取得に失敗しました。' },
      { status: 500 }
    );
  }
}
