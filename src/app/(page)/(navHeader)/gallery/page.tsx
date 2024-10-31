import BookshelfLayout from "@/app/components/common/BookshelfLayout";
import { prisma } from "../../../../../prisma/client";
import { auth } from "@/lib/auth";
import { User, userBook, Book } from "@prisma/client";
import GalleryCard from "@/app/components/gallery/GalleryCard";

const Gallery = async () => {
  const session = await auth();
  if (!session) return null;

  // 各ユーザーに関連する3冊の本の情報を取得
  const fetchUsers: (User & { userBook: (userBook & { book: Book })[] })[] = await prisma.user.findMany({
    where: { public: true, userBook: { some: {} } },
    include: {
      userBook: {
        include: { book: true },
        take: 3, // 各ユーザーあたり3冊の本を取得
      },
    },
  });

  return (
    <BookshelfLayout title="本棚ギャラリー">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fetchUsers.map((user) => (
          <GalleryCard
            key={user.id}
            userId={user.id}
            userName={user.name || ""}
            userPhotoURL={user.image || ""}
            userBooks={user.userBook} // 取得した最大3冊の本を渡す
          />
        ))}
      </div>
    </BookshelfLayout>
  );
};

export default Gallery;
