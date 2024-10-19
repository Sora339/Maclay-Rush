import Image from "next/image";
import Header from "@/app/layout/header/header";
import Footer from "@/app/layout/footer/footer";
import { Book } from "@/../src/types/game"; // 指定されたBook型をインポート
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import Loading from "@/app/components/loading";
import { prisma } from "../../../../../../prisma/client";
import { auth } from "@/lib/auth";

const UserBookshelf = async () => {
  const session = await auth();
  if (!session) return null;
  const books = await prisma.book.findMany()
  return (
    <div>
      {/* <Loading /> */}
      <div
        className="bg-[url('../../public/image/bg-gallery.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed"
      >
        <div className="flex flex-col min-h-screen">
          <div className="container mx-auto p-4 flex-grow">
            <h1 className="text-5xl text-white mb-4">
              {session.user?.name}さんの本棚
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="border overflow-y-scroll h-[400px] p-2 rounded bg-white"
                >
                  <div className="justify-between items-center">
                    <button className="w-full" onClick={() => handleLike(book.id)}>
                      {likedBooks.includes(book.id) ? (
                        <div className="flex gap-1 justify-end">
                          <p>お気に入り</p>
                          <IoHeartSharp className="text-red-500 text-2xl" />
                        </div>
                      ) : (
                        <div className="flex gap-1 justify-end">
                          <p>お気に入り</p>
                          <IoHeartOutline className="text-gray-500 text-2xl" />
                        </div>
                      )} 
                    </button>
                    <h2 className="text-xl font-semibold">
                      {book.volumeInfo.title}
                    </h2>
                  </div>
                  {book.volumeInfo.imageLinks?.smallThumbnail && (
                    <div className="flex justify-center">
                      <Image
                        src={book.volumeInfo.imageLinks.smallThumbnail}
                        alt={book.volumeInfo.title}
                        width={128}
                        height={200}
                        objectFit="cover"
                        className="rounded mt-2 mb-2"
                      />
                    </div>
                  )}
                  <p className="mb-2">
                    {book.volumeInfo.description?.replace(/<wbr>/g, "")}
                  </p>
                  {book.saleInfo?.saleability === "FOR_SALE" &&
                    book.saleInfo.buyLink && (
                      <a
                        href={book.saleInfo.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        購入リンク
                      </a>
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

export default UserBookshelf;
