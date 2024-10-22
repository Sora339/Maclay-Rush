"use client";

import { useState, useTransition } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { toggleFavorite } from "@/app/actions/favorite";

interface LikeButtonProps {
  userId: string;
  bookId: string;
  bookData: {
    title: string;
    thumbnailURL: string;
    saleability: boolean;
    buyLink: string;
    description: string;
  };
  isFavorite: boolean;
}

export default function LikeButton({
  userId,
  bookId,
  bookData,
  isFavorite,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await toggleFavorite(userId, bookId, bookData);

      if (result.error) {
        setError(result.error);
        console.error("Error:", result.error);
      } else if (typeof result.liked === "boolean") {
        setLiked(result.liked);
        setError(null);
      }
    });
  };

  return (
    <div>
      <form action={handleSubmit}>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center"
        >
          <span>お気に入り</span>
          {liked ? (
            <IoHeartSharp className="text-red-500 text-2xl" />
          ) : (
            <IoHeartOutline className="text-gray-500 text-2xl" />
          )}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
