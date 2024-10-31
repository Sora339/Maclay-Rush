import { Review } from "@prisma/client";
import Image from "next/image";

interface UserReviewProps {
  review: Review & { user: { name: string | null; image: string | null } };
}

const UserReview: React.FC<UserReviewProps> = ({ review }) => (
  <div className="mt-2 pt-2">
    <div className="flex items-center mb-1">
      <Image src={review.user.image || "/default-avatar.png"} alt={review.user.name || "User"} width={32} height={32} className="rounded-full mr-2" />
      <p className="font-semibold">{review.user.name || "匿名ユーザー"}</p>
    </div>
    <p className="text-sm mb-2">{review.content}</p>
    <p className="text-xs text-gray-200">{new Date(review.createdAt).toLocaleDateString()}</p>
  </div>
);

export default UserReview;
