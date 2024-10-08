"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Image from "next/image";
import Header from "@/app/layout/header/header";
import Footer from "@/app/layout/footer/footer";
import { Book } from "@/../src/types/game"; // 指定されたBook型をインポート
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client"; // Firebase auth
import Loading from "@/app/components/loading";

const UserBookshelf = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedBooks, setLikedBooks] = useState<string[]>([]);
  const router = useRouter();
  const { userId: bookshelfUserId } = useParams();

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        if (typeof bookshelfUserId === "string") {
          const userDoc = await getDoc(doc(db, "users", bookshelfUserId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.name || "Anonymous");

            const bookPromises = data.likes
              .slice(0, 10)
              .map(async (bookId: string) => {
                const response = await fetch(
                  `https://www.googleapis.com/books/v1/volumes/${bookId}`
                );
                if (response.ok) {
                  const bookData = await response.json();
                  return bookData as Book;
                } else {
                  console.error(
                    `Failed to fetch details for book ID: ${bookId}`
                  );
                  return null;
                }
              });

            const fetchedBooks = await Promise.all(bookPromises);
            setBooks(fetchedBooks.filter((book) => book !== null) as Book[]);
          } else {
            router.push("/gallery");
          }
        } else {
          console.error("Invalid userId:", bookshelfUserId);
          router.push("/gallery");
        }
      } catch (error) {
        console.error("Error fetching user bookshelf:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedBooks = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setLikedBooks(data.likes || []);
        }
      } catch (error) {
        console.error("Error fetching liked books: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchLikedBooks(user.uid);
      } else {
        router.push("/auth");
      }
    });

    fetchUserBooks();
    return () => unsubscribe();
  }, [bookshelfUserId, router]);

  const handleLike = async (bookId: string) => {
    if (!userId) return;

    const userDocRef = doc(db, "users", userId);
    try {
      if (likedBooks.includes(bookId)) {
        await updateDoc(userDocRef, {
          likes: arrayRemove(bookId),
        });
        setLikedBooks(likedBooks.filter((id) => id !== bookId));
      } else {
        await updateDoc(userDocRef, {
          likes: arrayUnion(bookId),
        });
        setLikedBooks([...likedBooks, bookId]);
      }
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  if (loading) {
    return <div className="fixed inset-0 bg-gray-900 text-white text-2xl">
            <div className="flex items-center justify-center h-screen">
              <img className="mr-4" src="/image/stack-of-books.png" alt="" />
              <p>Loading...</p>
            </div>
          </div>;
  }

  return (
    <div>
      <Loading />
      <div
        className="bg-[url('../../public/image/bg-gallery.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed"
      >
        <div className="flex flex-col min-h-screen">
          <div className="container mx-auto p-4 flex-grow">
            <h1 className="text-5xl text-white mb-4">
              {userName}さんの本棚
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
