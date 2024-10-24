import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "../../../../lib/auth";
import Select from "@/app/components/myPage/Select";
import { prisma } from "../../../../../prisma/client";

const  MyPage = async () => {
  const session = await auth();
  if (!session) return null;

  const fetchTotalScore = async() => {
    const result = await prisma.gameResult.aggregate({
      where: {
        userid: session.user?.id
      },
      _sum: {
        score: true
      }
    })
    return result._sum.score || 0;
  }

  const totalScore : number | null = await fetchTotalScore()

  const getRank = (score: number | null): string => {
    if (score === null) return "新米司書";
    if (score >= 3000) return "図書館長";
    if (score >= 2000) return "上級司書";
    if (score >= 1000) return "熟練司書";
    if (score >= 500) return "若手司書";
    return "新米司書";
  };

  return (
    <div>
      {/* <Loading /> */}
      <div className="bg-[url('../../public/image/bg-mypage.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed z-0 relative">
        <div className="flex flex-col min-h-[calc(100vh-10rem)]">
          <div className="container mx-auto p-4 flex-grow items-center justify-center flex gap-20">
            {session.user ? (
              <div>
                <div className="container items-center bg-[url('/image/gamecard.jpg')] rounded-md w-[424px] mx-auto h-[600px]">
                  <div className="p-4">
                    <h2 className="text-white text-4xl">図書館証</h2>
                    <div className="flex items-center justify-center mt-6 gap-10">
                      <Avatar className="size-20 ml-2">
                        <AvatarImage
                          src={session.user.image as string}
                          className="size-20"
                        />
                        <AvatarFallback>{session.user.name}</AvatarFallback>
                      </Avatar>
                      <div className="flex justify-center">
                        <h1 className="text-3xl text-white">{session.user.name}</h1>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-2xl mt-6 mb-16">
                      本日の残り業務シフト <br /> 5回（0:00AM更新）
                    </p>
                  </div>
                  <div className="h-40 w-[350px] mx-auto">
                    <div className="h-40 flex flex-col justify-between">
                      <div className="flex">
                        <p className="text-3xl text-white">経験値: </p>
                        {totalScore !== null && (
                          <h1 className="text-3xl ml-auto text-white">
                            {totalScore}
                          </h1>
                        )}
                      </div>
                      <hr />
                      <div className="flex">
                        <p className="text-3xl text-white">職位: </p>
                        <h1 className="text-3xl ml-auto text-white">
                          {getRank(totalScore)}
                        </h1>
                      </div>
                      <hr />
                      <div className="flex">
                        <p className="text-3xl text-white">称号: </p>
                        <h1 className="text-3xl ml-auto text-white">
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>User data not found.</div>
            )}
            <div className="border-[1px] h-[70vh]"></div>
              <Select />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
