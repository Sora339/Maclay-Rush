"use client";

import { useState } from "react";
import { saveReview } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { BiPencil } from "react-icons/bi";
import ReviewModal from "./ReviewModal";

const ReviewButton = ({
  bookId,
  userId,
}: {
  bookId: string;
  userId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button className="rounded bg-stone-700 mb-2" onClick={openModal}>
        <BiPencil />
        レビューを書く
      </Button>

      {isModalOpen && (
        <ReviewModal
          bookId={bookId}
          userId={userId}
          onClose={closeModal}
          saveReview={saveReview}
        />
      )}
    </>
  );
};

export default ReviewButton;