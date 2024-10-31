"use client";

import { startTransition, useEffect, useState } from "react";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { getPublishStatus, togglePublish } from "../../actions/publish";

export default function PublishButton({ userId }: { userId: string }) {
  const [isPublic, setIsPublic] = useState<boolean | null>(null); // Use null initially to detect loading state.

  // Fetch the current status when the component loads.
  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getPublishStatus(userId);
      setIsPublic(status);
    };
    fetchStatus();
  }, [userId]);

  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await togglePublish(userId);
      if (result !== null) {
        setIsPublic(result);
      }
    });
  };

  if (isPublic === null) return <div>Loading...</div>; // Show loading indicator.

  return (
    <button onClick={handleSubmit} className="text-xl w-full flex justify-end">
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
