import BookshelfLayout from "@/app/components/common/BookshelfLayout";
import { prisma } from "../../../../../../prisma/client";
import { auth } from "@/lib/auth";
import { userBook, Review, User, Book } from "@prisma/client";
import BookCard from "@/app/components/common/BookCard";

const UserBookshelf = async ({ params }: { params: { userId: string } }) => {
  const session = await auth();
  if (!session?.user?.id) return null;

  // `UserBook & { book: Book; user: User }` 型の配列
  const userBooks: (userBook & { book: Book; user: User })[] = await prisma.userBook.findMany({
    where: { userId: params.userId },
    include: { book: true, user: true },
  });

  // `Review & { user: User }` 型の配列
  const reviews: (Review & { user: User })[] = await prisma.review.findMany({
    where: { bookId: { in: userBooks.map((book) => book.bookId) } },
    include: { user: true },
  });

  const userName = userBooks[0]?.user?.name || "匿名ユーザー";

  return (
    <BookshelfLayout title={`${userName}さんの本棚`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {userBooks.map((userBook) => (
          <BookCard
            key={userBook.id}
            book={userBook.book}
            isFavorite={session.user?.id === params.userId}
            reviews={reviews.filter((review) => review.bookId === userBook.bookId)}
            userId={session.user?.id || ""}
          />
        ))}
      </div>
    </BookshelfLayout>
  );
};

export default UserBookshelf;
