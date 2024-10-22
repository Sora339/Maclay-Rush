"use client";

import { startTransition, useState } from "react";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { togglePublish } from "../actions/publish";

export default function PublishButton({ userId }: { userId: string }) {
  const [isPublic, setIsPublic] = useState(false);
  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await togglePublish(userId);

      if (result) {
        setIsPublic(true);
      } else {
        setIsPublic(false);
      }
    });
  };
  return (
    <button onClick={handleSubmit} className="text-xl">
      {isPublic ? (
        <div className="flex items-center gap-2">
          <FaUnlockAlt className="text-green-500" />
          <span className="text-white">公開する</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FaLock className="text-red-500" />
          <span className="text-white">公開しない</span>
        </div>
      )}
    </button>
  );
}
