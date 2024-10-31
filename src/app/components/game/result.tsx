"use client";

import { Book } from "@/../src/types/game"; // 共通の型をインポート
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "../common/likeButton";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";

interface ResultProps {
  score: number;
  books: Book[];
  userId: string;
  onReset: () => void; // ゲームリセットのためのプロパティ
}

export default function Result({ score, books, userId, onReset }: ResultProps) {
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const res = await fetch(`/api/favorites/${userId}`);
        if (!res.ok) throw new Error("お気に入りの取得に失敗しました");
        const data = await res.json();
        setFavoriteBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, [userId]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="fixed inset-0 bg-[#252525] bg-opacity-50 flex justify-center items-center">
      <div className="bg-stone-600 text-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-4">ゲーム結果</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                onReset(); // リセット処理を実行
              }}
              className="mt-4 bg-green-500 text-white mb-6 py-2 px-4 rounded"
            >
              やり直す
            </Button>
            <Link href="/myPage">
              <Button className="mt-4 bg-red-500 text-white mb-6 py-2 px-4 rounded">
                マイページ
              </Button>
            </Link>
            <Link href="/rankingPage">
              <Button className="mt-4 bg-yellow-500 text-white mb-6 py-2 px-4 rounded">
                ランキング
              </Button>
            </Link>
          </div>
        </div>
        <p className="mb-4">最終スコア: {score}</p>
        <div className="max-h-[400px] overflow-y-auto">
          {books.map((book) => {
            const isFavorite = favoriteBooks.includes(book.id);
            const preview = Boolean(book.volumeInfo.previewLink); // previewが存在するか確認

            return (
              <div key={book.id} className="mb-4 p-4 rounded">
                <div className="flex justify-end">
                  <LikeButton
                    userId={userId}
                    bookId={book.id}
                    bookData={{
                      title: book.volumeInfo.title,
                      thumbnailURL:
                        book.volumeInfo.imageLinks?.smallThumbnail || "",
                      saleability: book.saleInfo?.saleability === "FOR_SALE",
                      buyLink: book.saleInfo?.buyLink || "",
                      description:
                        book.volumeInfo.description || "説明がありません。",
                      previewLink: book.volumeInfo.previewLink,
                    }}
                    isFavorite={isFavorite}
                  />
                </div>
                <h2 className="text-xl font-semibold">
                  {book.volumeInfo.title}
                </h2>
                <div className="flex my-2">
                  {book.volumeInfo.imageLinks?.smallThumbnail && (
                    <div className="mb-2 mr-2 w-[200px] h-[300px]">
                      <Image
                        src={book.volumeInfo.imageLinks.smallThumbnail}
                        alt={book.volumeInfo.title || "本の表紙"}
                        width={200}
                        height={300}
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                  <p className="ml-4 w-[500px]">
                    {book.volumeInfo.description || "説明がありません。"}
                  </p>
                </div>
                <div className="w-full flex gap-2 justify-end text-right">
                  {preview && (
                    <Button className="rounded bg-stone-700">
                      <Link
                        href={book.volumeInfo.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <IoMdSearch />
                        プレビュー
                      </Link>
                    </Button>
                  )}
                  {book.saleInfo?.saleability === "FOR_SALE" &&
                    book.saleInfo?.buyLink && (
                      <Button className="rounded bg-stone-700">
                        <Link
                          href={book.saleInfo.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <HiOutlineShoppingCart />
                          購入リンク
                        </Link>
                      </Button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
