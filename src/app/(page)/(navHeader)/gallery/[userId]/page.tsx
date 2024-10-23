import Image from "next/image";
import { prisma } from "../../../../../../prisma/client";
import { auth } from "@/lib/auth";
import LikeButton from "@/app/components/likeButton";

const UserBookshelf = async ({ params }: { params: { userId: string } }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const currentUserId: string = session.user.id;

  const { userId } = params;

  const userBooks = await prisma.userBook.findMany({
    where: { userid: userId },
    include: {
      Book: true,
      user: true,
    },
    take: 3, // 本の取得数を3冊に制限
  });

  const myFavoriteBooks = await prisma.userBook.findMany({
    where: { userid: currentUserId },
    select: { bookid: true },
  });

  const myFavoriteBookIds = myFavoriteBooks.map((book) => book.bookid);

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
              const isFavorite = myFavoriteBookIds.includes(userBook.bookid);

              return (
                <div
                  key={userBook.id}
                  className="border overflow-y-scroll h-[400px] p-2 rounded bg-white"
                >
                  <div className="flex justify-end">
                    <LikeButton
                      userId={currentUserId} // 明示的に型が保証された変数を使用
                      bookId={userBook.bookid}
                      bookData={{
                        title: userBook.Book.title,
                        thumbnailURL: userBook.Book.thumbnailURL || "",
                        saleability: userBook.Book.saleability === true,
                        buyLink: userBook.Book.buyLink || "",
                        description:
                          userBook.Book.description || "説明がありません。",
                      }}
                      isFavorite={isFavorite}
                    />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {userBook.Book.title}
                  </h2>

                  {userBook.Book.thumbnailURL && (
                    <div className="flex justify-center">
                      <Image
                        src={userBook.Book.thumbnailURL}
                        alt={userBook.Book.title}
                        width={128}
                        height={200}
                        objectFit="cover"
                        className="rounded mt-2 mb-2"
                      />
                    </div>
                  )}
                  <p className="mb-2">
                    {userBook.Book.description.replace(/<wbr>/g, "")}
                  </p>
                  {userBook.Book.saleability && userBook.Book.buyLink && (
                    <a
                      href={userBook.Book.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      購入リンク
                    </a>
                  )}
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
