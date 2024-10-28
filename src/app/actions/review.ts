"use server";

import { prisma } from "../../../prisma/client";


interface ReviewInput {
  userId: string;
  bookId: string;
  content: string;
}

export async function saveReview({ userId, bookId, content }: ReviewInput) {
  try {
    await prisma.review.create({
      data: {
        userId: userId,
        bookId: bookId,
        content,
        createdAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to save review:", errorMessage);
    return { success: false, error: errorMessage };
  }
}