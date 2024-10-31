import Image from "next/image";
import Link from "next/link";
import { Book } from "@prisma/client";

interface GalleryCardProps {
  userId: string;
  userName: string;
  userPhotoURL: string;
  userBooks: { book: Book }[]; // 各本のデータ
}

const GalleryCard: React.FC<GalleryCardProps> = ({ userId, userName, userPhotoURL, userBooks }) => (
  <Link href={`/gallery/${userId}`}>
    <div className="p-4 rounded shadow-md cursor-pointer bg-stone-600 text-white">
      <div className="flex items-center mb-4">
        <Image src={userPhotoURL} alt={userName} width={40} height={40} className="rounded-full" />
        <h2 className="text-lg font-semibold ml-3">{userName}</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {userBooks.map((userBook) => (
          <Image
            key={userBook.book.id}
            src={userBook.book.thumbnailURL}
            alt={userBook.book.title}
            width={100}
            height={150}
            objectFit="cover"
            className="rounded"
          />
        ))}
      </div>
    </div>
  </Link>
);

export default GalleryCard;
