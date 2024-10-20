'use client';

import { useState, useTransition } from 'react';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import { toggleFavorite } from '@/app/actions/favorite'; // サーバーアクションのインポート

interface LikeButtonProps {
  userId: string;
  bookId: string;
  bookData: {
    thumbnailURL: string;
    saleability: boolean;
    buyLink: string;
    description: string;
  };
}

export default function LikeButton({ userId, bookId, bookData }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null); // エラーメッセージ用の状態

  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await toggleFavorite(userId, bookId, bookData);

      if (result.error) {
        setError(result.error); // エラーメッセージを設定
        console.error('Error:', result.error);
      } else if (typeof result.liked === 'boolean') {
        setLiked(result.liked);
        setError(null); // エラーをリセット
      }
    });
  };

  return (
    <div>
      <form action={handleSubmit}>
        <button type="submit" disabled={isPending} className="flex items-center">
          {liked ? (
            <IoHeartSharp className="text-red-500 text-2xl" />
          ) : (
            <IoHeartOutline className="text-gray-500 text-2xl" />
          )}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* エラーメッセージの表示 */}
    </div>
  );
}
