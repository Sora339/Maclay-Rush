import Image from "next/image";
import { prisma } from "../../../../../../prisma/client";
import { auth } from "@/lib/auth";
import LikeButton from "@/app/components/likeButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";

const UserBookshelf = async ({ params }: { params: { userId: string } }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const currentUserId: string = session.user.id;

  const { userId } = params;

  const userBooks = await prisma.userBook.findMany({
    where: { userId: userId },
    include: {
      book: true,
      user: true,
    },
  });

  // 各本のIDに関連するレビューを取得
  const bookIds = userBooks.map((book) => book.bookId);
  const reviews = await prisma.review.findMany({
    where: {
      bookId: { in: bookIds },
    },
    include: {
      user: true, // レビューを書いたユーザー情報を取得
    },
  });

  // 型定義
  type ReviewGroupedByBookId = {
    [key: string]: (typeof reviews)[0][];
  };

  // 本ごとに関連するレビューをグループ化
  const reviewsByBookId: ReviewGroupedByBookId = reviews.reduce(
    (acc, review) => {
      if (!acc[review.bookId]) acc[review.bookId] = [];
      acc[review.bookId].push(review);
      return acc;
    },
    {} as ReviewGroupedByBookId
  );

  const myFavoriteBooks = await prisma.userBook.findMany({
    where: { userId: currentUserId },
    select: { bookId: true },
  });

  const myFavoriteBookIds = myFavoriteBooks.map((book) => book.bookId);

  if (userBooks.length === 0) {
    return <p>このユーザーの本棚は空です。</p>;
  }

  const userName = userBooks[0]?.user?.name || "匿名ユーザー";

  return (
    <div className="bg-[url('../../public/image/bg-gallery.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed">
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto p-4 flex-grow">
          <h1 className="text-5xl text-white mb-4">{userName}さんの本棚</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userBooks.map((userBook) => {
              const isFavorite = myFavoriteBookIds.includes(userBook.bookId);

              return (
                <div
                  key={userBook.id}
                  className="overflow-y-scroll hidden-scrollbar h-[400px] p-2 rounded bg-stone-600 text-white"
                >
                  <div className="flex justify-end">
                    <LikeButton
                      userId={currentUserId} // 明示的に型が保証された変数を使用
                      bookId={userBook.bookId}
                      bookData={{
                        title: userBook.book.title,
                        thumbnailURL: userBook.book.thumbnailURL || "",
                        saleability: userBook.book.saleability === true,
                        buyLink: userBook.book.buyLink || "",
                        previewLink: userBook.book.previewLink,
                        description:
                          userBook.book.description || "説明がありません。",
                      }}
                      isFavorite={isFavorite}
                    />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {userBook.book.title}
                  </h2>

                  {userBook.book.thumbnailURL && (
                    <div className="flex justify-center">
                      <Image
                        src={userBook.book.thumbnailURL}
                        alt={userBook.book.title}
                        width={128}
                        height={200}
                        objectFit="cover"
                        className="rounded mt-2 mb-2"
                      />
                    </div>
                  )}
                  <p className="mb-2">
                    {userBook.book.description.replace(/<wbr>/g, "")}
                  </p>
                  <div className="flex justify-end gap-2 mb-2">
                    {userBook.book.previewLink && (
                      <Button className="rounded bg-stone-700">
                        <Link
                          href={userBook.book.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <IoMdSearch />
                          プレビュー
                        </Link>
                      </Button>
                    )}
                    {userBook.book.saleability && userBook.book.buyLink && (
                      <Button className="rounded bg-stone-700 text-right">
                        <Link
                          href={userBook.book.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white flex items-center gap-1"
                        >
                          <HiOutlineShoppingCart />
                          購入リンク
                        </Link>
                      </Button>
                    )}
                  </div>
                  <hr />
                  <div>
                    <p className="font-semibold">レビュー</p>
                    {reviewsByBookId[userBook.bookId]?.map((review) => (
                      <div key={review.id} className="mt-2 pt-2">
                        <div className="flex items-center mb-1">
                          <Image
                            src={review.user.image || "/default-avatar.png"}
                            alt={review.user.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                          <p className="font-semibold">
                            {review.user.name || "匿名ユーザー"}
                          </p>
                        </div>
                        <p className="text-sm mb-2">{review.content}</p>
                        <p className="text-xs text-gray-200">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookshelf;
