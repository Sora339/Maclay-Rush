"use server";

import { prisma } from "../../../prisma/client";


interface GameResultInput {
  userId: string;
  score: number;
}

export async function saveGameResult({ userId, score }: GameResultInput) {
  try {
    await prisma.gameResult.create({
      data: {
        userid: userId,
        score,
        timestamp: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to save game result:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
