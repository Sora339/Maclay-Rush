import { Book, Review } from "@prisma/client";
import ReviewButton from "@/app/components/common/ReviewButton";
import { Button } from "@/components/ui/button";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "./likeButton";
import UserReview from "./UserReview";

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  reviews: (Review & { user: { name: string | null; image: string | null } })[];
  userId: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFavorite, reviews, userId }) => (
  <div className="p-2 rounded h-[400px] overflow-y-scroll hidden-scrollbar bg-stone-600 text-white">
    <div className="flex justify-end">
      <LikeButton userId={userId} bookId={book.id} bookData={book} isFavorite={isFavorite} />
    </div>
    <h2 className="text-xl font-semibold">{book.title}</h2>
    {book.thumbnailURL && (
      <div className="flex justify-center">
        <Image src={book.thumbnailURL} alt={book.title} width={128} height={200} objectFit="cover" className="rounded mt-2 mb-2" />
      </div>
    )}
    <p className="mb-2">{book.description?.replace(/<wbr>/g, "")}</p>
    <div className="gap-2 flex justify-end mb-2">
      {book.previewLink && (
        <Button className="rounded bg-stone-700">
          <Link href={book.previewLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <IoMdSearch /> プレビュー
          </Link>
        </Button>
      )}
      {book.saleability && book.buyLink && (
        <Button className="rounded bg-stone-700 mb-2">
          <Link href={book.buyLink} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1">
            <HiOutlineShoppingCart /> 購入リンク
          </Link>
        </Button>
      )}
    </div>
    <hr />
    <div>
      <p className="font-semibold">レビュー</p>
      {reviews.map((review) => (
        <UserReview key={review.id} review={review} />
      ))}
    </div>
    <div className="text-right">
      <ReviewButton bookId={book.id} userId={userId} />
    </div>
  </div>
);

export default BookCard;
