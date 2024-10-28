"use client";

import { useState, FormEvent } from "react";

interface ReviewModalProps {
  bookId: string;
  userId: string;
  onClose: () => void;
  saveReview: (data: { userId: string; bookId: string; content: string }) => Promise<{ success: boolean }>;
}

const ReviewModal = ({ bookId, userId, onClose, saveReview }: ReviewModalProps) => {
  const [review, setReview] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await saveReview({ userId, bookId, content: review });

    if (result.success) {
      onClose(); // モーダルを閉じる
      location.reload(); // ページを再読み込み
    } else {
      console.error("Failed to save review.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#252525] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252525] border-4 border-stone-500 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-left">レビューを書く</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            placeholder="レビューを入力してください"
            className="w-full p-2 border rounded-md mb-4 text-black"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="mr-2 text-gray-300" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;