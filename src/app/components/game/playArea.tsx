"use client";

import { startTransition, useEffect, useState, useCallback } from "react";
import useBooks from "@/app/hooks/useBook";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Bookshelf from "./Bookshelf";
import SubSet from "./subSet";
import Result from "./result";
import { saveGameResult } from "@/app/actions/saveGame";

interface PlayAreaProps {
  userId: string;
}

export default function PlayArea({ userId }: PlayAreaProps) {
  const {
    books,
    points,
    users,
    requestedBook,
    returnNotifications,
    handleLendBook,
    handleCheckBorrowed,
    resetGame,
    clearBorrowedBooks,
    message,
    isModalOpen,
    setSubject,
    handleStartGame,
    errorMessage,
    isBooksReady,
  } = useBooks();

  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

  const handleGameEnd = useCallback(() => {
    clearBorrowedBooks();
    setIsGameActive(false);

    startTransition(async () => {
      const result = await saveGameResult({ userId, score: points });
      if (!result.success) {
        console.error("Error saving game result:", result.error);
      }
      setShowResult(true);
    });
  }, [clearBorrowedBooks, points, userId]);

  useEffect(() => {
    if (isGameActive && isBooksReady && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && isGameActive) {
      handleGameEnd();
    }
  }, [timeLeft, isBooksReady, isGameActive, handleGameEnd]);

  const handleResetGame = () => {
    setTimeLeft(45);
    setShowResult(false);
    setIsGameActive(false);
    resetGame();
  };

  const startGame = () => {
    setIsGameActive(true);
    handleStartGame();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div>
      <div className="bg-[url('/image/bg_1.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay">
        <div className="h-screen mx-auto md:scale-50 lg:scale-75 xl:scale-100">
          <div className="h-full flex flex-col justify-center">
            <div className="container flex justify-between">
              <div>
                <p className="text-white text-3xl">現在のポイント: {points}</p>
                <p className="text-white text-2xl mb-2">
                  残り時間: {formatTime(timeLeft)}
                </p>
              </div>
              <Button
                onClick={handleGameEnd}
                className="mt-4 bg-green-500 text-white mb-6 py-2 px-4 rounded"
              >
                ゲーム終了
              </Button>
            </div>
            <div className="flex gap-12 items-center justify-center">
              <div className="top-0 h-full w-fit">
                <div className="bg-[url('../../public/image/clipboard.png')] bg-contain container bg-no-repeat h-full pt-12 w-[338px]">
                  <Image
                    src={`/image/cus_${users % 8}.webp`}
                    alt="customer"
                    priority
                    width={200}
                    height={200}
                    className="mx-auto mb-2 rounded-xl"
                  />
                  {requestedBook && (
                    <div className="mb-4">
                      <h2 className="text-xl h-[20%] hidden-scrollbar overflow-y-scroll">
                        利用者No.{users}の希望:
                        <br /> {requestedBook.volumeInfo.title}
                      </h2>
                      <div className="mt-2 h-[10px]">
                        <p
                          style={{
                            color:
                              message === "正しく貸し出せました。" ||
                              message === "正解！この本は貸出中です！"
                                ? "green"
                                : "red",
                          }}
                        >
                          {message}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="mb-2 text-xl">返却通知</p>
                  <div className="h-[35%] overflow-y-scroll hidden-scrollbar">
                    {returnNotifications.map((notification, index) => (
                      <p key={index} className="bg-gray-200 p-2 rounded mb-2">
                        {notification}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-full w-fit">
                <Bookshelf
                  books={books}
                  onLendBook={handleLendBook}
                  onCheckBorrowed={handleCheckBorrowed}
                />
              </div>
            </div>
          </div>
        </div>
        <SubSet
          isModalOpen={isModalOpen}
          setSubject={setSubject}
          handleStartGame={startGame}
          errorMessage={errorMessage}
        />
        {showResult && (
          <Result
            score={points}
            books={books}
            userId={userId}
            onReset={handleResetGame}
          />
        )}
      </div>
    </div>
  );
}
