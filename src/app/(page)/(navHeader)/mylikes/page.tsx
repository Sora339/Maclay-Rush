import BookshelfLayout from "@/app/components/common/BookshelfLayout";
import { prisma } from "../../../../../prisma/client";
import { auth } from "@/lib/auth";

import { userBook, Review, Book, User } from "@prisma/client"; // Prisma で生成された型をインポート
import PublishButton from "@/app/components/mylikes/publishButton";
import BookCard from "@/app/components/common/BookCard";

const MyLikes = async () => {
  const session = await auth();
  if (!session?.user) return null;

  // `UserBook & { book: Book }` 型の配列
  const likedBooks: (userBook & { book: Book })[] = await prisma.userBook.findMany({
    where: { userId: session.user?.id },
    include: { book: true },
  });

  // `Review & { user: User }` 型の配列
  const reviews: (Review & { user: User })[] = await prisma.review.findMany({
    where: { bookId: { in: likedBooks.map((book) => book.bookId) } },
    include: { user: true },
  });

  return (
    <BookshelfLayout title="My本棚">
      <PublishButton userId={session.user?.id || ""} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {likedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book.book}
            isFavorite={true}
            reviews={reviews.filter((review) => review.bookId === book.bookId)}
            userId={session.user?.id || ""}
          />
        ))}
      </div>
    </BookshelfLayout>
  );
};

export default MyLikes;
