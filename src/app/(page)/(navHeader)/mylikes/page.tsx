import LikeButton from "@/app/components/likeButton";
import Image from "next/image";
import { prisma } from "../../../../../prisma/client";
import { auth } from "@/lib/auth";
import PublishButton from "@/app/components/publishButton";

const MyLikes = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const likedBooks = await prisma.userBook.findMany({
    where: {
      userid: session.user?.id,
    },
    include: {
      Book: true,
    },
  });

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
                  className="border p-2 rounded h-[400px] overflow-y-scroll bg-white"
                >
                  <div className="flex justify-end">
                    <LikeButton
                      userId={session.user?.id || ""}
                      bookId={book.bookid}
                      bookData={{
                        title: book.Book.title,
                        thumbnailURL: book.Book.thumbnailURL || "",
                        saleability: book.Book.saleability === true,
                        buyLink: book.Book.buyLink || "",
                        description:
                          book.Book.description || "説明がありません。",
                      }}
                      isFavorite={true} // 初期値として true を渡す
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{book.Book.title}</h2>
                  {book.Book.thumbnailURL && (
                    <div className="flex justify-center">
                      <Image
                        src={book.Book.thumbnailURL}
                        alt={book.Book.title}
                        width={128}
                        height={200}
                        objectFit="cover"
                        className="rounded mt-2 mb-2"
                      />
                    </div>
                  )}
                  <p className="mb-2">
                    {book.Book.description?.replace(/<wbr>/g, "")}
                  </p>
                  {book.Book.saleability === true && book.Book.buyLink && (
                    <div className="text-right">
                      <a
                        href={book.Book.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 ml-auto"
                      >
                        購入リンク
                      </a>
                    </div>
                  )}
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
