import { Book } from "@/../src/types/game"; // 共通型をインポート

// 1秒待機する関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchBooks = async (subject: string): Promise<Book[]> => {
  let allBooks: Book[] = [];
  const titleSet = new Set<string>();
  let attempts = 0;

  while (allBooks.length < 8 && attempts < 3) {
    const randomStartIndex = Math.floor(Math.random() * 100);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&maxResults=8&startIndex=${randomStartIndex}&orderBy=newest&langRestrict=ja`
      );

      const data = await response.json();

      const uniqueBooks = (data.items || []).filter((book: Book) => {
        const title = book.volumeInfo.title;
        if (!titleSet.has(title)) {
          titleSet.add(title);
          return true;
        }
        return false;
      });

      allBooks = [...allBooks, ...uniqueBooks];
      allBooks = allBooks.slice(0, 8); // 必要な8冊だけ残す
    } catch (error) {
      console.error("Error fetching books:", error);
    }

    attempts++;
    if (allBooks.length < 8) await delay(1000); // 次のリクエスト前に1秒待機
  }

  return allBooks;
};
