"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, GalleryHorizontalEnd, LibraryBig, NotebookPen } from "lucide-react";
export default function Select() {
  return (
    <div className="w-[52%] flex flex-col gap-4 text-right">
      <motion.div
        animate={{
          x: [100, 0],
          opacity: 1,
          transition: { type: "spring", duration: 0.5 },
        }}
        whileHover={{ scale: 1.1 }}
        className="bg-[url('/image/select2.svg')] bg-contain bg-no-repeat w-[87%]"
      >
        <Link href="/game">
          <button className="h-max">
            <p className="text-5xl p-10 text-white flex items-center gap-4">
              貸出業務
              <NotebookPen className="text-5xl size-11" />
            </p>
          </button>
        </Link>
      </motion.div>
      <motion.div
        animate={{
          x: [-100, 0],
          opacity: 1,
          transition: { type: "spring", duration: 0.5 },
        }}
        whileHover={{ scale: 1.1 }}
        className="bg-[url('/image/select3.svg')] bg-contain bg-no-repeat w-[87%] ml-auto"
      >
        <Link href="/mylikes">
          <button className="h-max">
            <p className="text-5xl p-10 text-white flex items-center gap-4">
              My本棚
              <LibraryBig className="text-5xl size-11" />
            </p>
          </button>
        </Link>
      </motion.div>
      <motion.div
        animate={{
          x: [100, 0],
          opacity: 1,
          transition: { type: "spring", duration: 0.5 },
        }}
        whileHover={{ scale: 1.1 }}
        className="bg-[url('/image/select4.svg')] bg-contain bg-no-repeat w-[87%]"
      >
        <Link href="/gallery">
          <button className="h-max">
            <p className="text-5xl p-10 text-white flex items-center gap-4">
              ギャラリー
              <GalleryHorizontalEnd className="text-5xl size-11" />
            </p>
          </button>
        </Link>
      </motion.div>
      <motion.div
        animate={{
          x: [-100, 0],
          opacity: 1,
          transition: { type: "spring", duration: 0.5 },
        }}
        whileHover={{ scale: 1.1 }}
        className="bg-[url('/image/select5.svg')] bg-contain bg-no-repeat w-[87%] ml-auto"
      >
        <Link href="/rankingPage">
          <button className="h-max">
            <p className="text-5xl p-10 text-white flex items-center gap-4">
              ランキング
              <Crown className="text-5xl size-11" />
            </p>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
