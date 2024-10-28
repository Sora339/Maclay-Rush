import LikeButton from "@/app/components/likeButton";
import Image from "next/image";
import { prisma } from "../../../../../prisma/client";
import { auth } from "@/lib/auth";
import PublishButton from "@/app/components/publishButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineShoppingCart } from "react-icons/hi";
import ReviewButton from "@/app/components/mylikes/ReviewButton";
import { IoMdSearch } from "react-icons/io";

const MyLikes = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const likedBooks = await prisma.userBook.findMany({
    where: {
      userId: session.user?.id,
    },
    include: {
      book: true,
    },
  });

  // 各本のIDに関連するレビューを取得
  const bookIds = likedBooks.map((book) => book.bookId);
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

  return (
    <div>
      <div className="bg-[url('../../public/image/bg-gallery.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed">
        <div className="flex flex-col min-h-screen">
          <div className="container mx-auto p-4 flex-grow">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-5xl text-white">My本棚</h1>
              <PublishButton userId={session.user?.id || ""} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {likedBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-2 rounded h-[400px] overflow-y-scroll hidden-scrollbar bg-stone-600 text-white"
                >
                  <div className="flex justify-end">
                    <LikeButton
                      userId={session.user?.id || ""}
                      bookId={book.bookId}
                      bookData={{
                        title: book.book.title,
                        thumbnailURL: book.book.thumbnailURL || "",
                        saleability: book.book.saleability === true,
                        buyLink: book.book.buyLink || "",
                        previewLink: book.book.previewLink,
                        description:
                          book.book.description || "説明がありません。",
                      }}
                      isFavorite={true} // 初期値として true を渡す
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{book.book.title}</h2>
                  {book.book.thumbnailURL && (
                    <div className="flex justify-center">
                      <Image
                        src={book.book.thumbnailURL}
                        alt={book.book.title}
                        width={128}
                        height={200}
                        objectFit="cover"
                        className="rounded mt-2 mb-2"
                      />
                    </div>
                  )}
                  <p className="mb-2">
                    {book.book.description?.replace(/<wbr>/g, "")}
                  </p>
                  <div className="gap-2 flex justify-end mb-2">
                    {book.book.previewLink && (
                      <Button className="rounded bg-stone-700">
                        <Link
                          href={book.book.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <IoMdSearch />
                          プレビュー
                        </Link>
                      </Button>
                    )}
                    {book.book.saleability === true && book.book.buyLink && (
                      <Button className="rounded bg-stone-700 mb-2">
                        <Link
                          href={book.book.buyLink}
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
                    {reviewsByBookId[book.bookId]?.map((review) => (
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
                  <div className="text-right">
                    <ReviewButton
                      bookId={book.bookId}
                      userId={session.user?.id || ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLikes;
