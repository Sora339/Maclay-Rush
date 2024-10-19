import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function LikeButton() {
  return (
    //サーバーアクションを使って、userBookにお気に入り登録をする
    <div>
      <button onClick={() => handleLike(book.id)}>
        {likedBooks.includes(book.id) ? (
          <div className="flex gap-1">
            <p>お気に入り</p>
            <IoHeartSharp className="text-red-500 text-2xl" />
          </div>
        ) : (
          <IoHeartOutline className="text-gray-500 text-2xl" />
        )}
      </button>
    </div>
  );
}
