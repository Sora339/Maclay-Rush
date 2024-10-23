import Link from "next/link";
import LogOutButton from "./logOutButton";
import StartButton from "@/app/components/top/startButton";
import { Crown, GalleryHorizontalEnd, LibraryBig } from "lucide-react";
import HowToPlaySection from "@/app/components/top/howToPlay/howToSection";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";


const Header = async () => {
  const session = await auth();
  if (!session) {
    redirect("/")
  };
  return (
    <div>
      <header className="bg-[#252525] h-[80px]">
        <div
          className="container flex h-full max-w-[1200px] items-center justify-between"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="flex gap-20 items-center">
            <Link href="/myPage" className="flex">
              <h1 className="flex items-center text-white text-3xl font-bold">
                Maclay Rush
              </h1>
            </Link>
            <nav>
              <ul className="text-white flex gap-10">
                <li>
                  <Link className="flex gap-2" href="/mylikes">
                    <LibraryBig />
                    My本棚
                  </Link>
                </li>
                <li>
                  <Link className="flex gap-2" href="/gallery">
                    <GalleryHorizontalEnd />
                    ギャラリー
                  </Link>
                </li>
                <li>
                  <Link className="flex gap-2" href="/rankingPage">
                    <Crown />
                    ランキング
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex gap-5">
            <div>
              <HowToPlaySection />
            </div>
            {session.user ? (
              <div>
                <LogOutButton />
              </div>
            ) : (
              <div>
                <StartButton />
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
