"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const letters = ["L", "o", "a", "d", "i", "n", "g", ".", ".", "."];

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 text-white text-2xl z-10">
      <div className="flex items-center justify-center h-screen">
        <Image className="mr-4" src="/image/stack-of-books.png" alt="" />
        <motion.div
          className="flex"
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        >
          <motion.div className="flex">
            {letters.map((letter, index) => (
              <motion.p
                key={index}
                animate={{ y: [0, -50, 0] }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
                style={{ display: "inline-block", marginRight: 4 }}
              >
                {letter}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
