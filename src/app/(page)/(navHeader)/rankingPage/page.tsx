import { auth } from "@/lib/auth";
import { prisma } from "../../../../../prisma/client";

const Ranking = async () => {
  const session = await auth();
  if (!session) return null;

  const fetchScore = await prisma.gameResult.aggregate({
    where: {
      userid: session.user?.id
    },
    _max: {
      score: true,
    }
  })

  if (!fetchScore) return null;
  const highScore = fetchScore._max.score

  const rankings = await prisma.gameResult.findMany({
    orderBy: {
      score: 'desc',
    },
    take: 10,
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  })

  return (
    <div>
      <div
        className="bg-[url('../../public/image/bg-ranking.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay bg-fixed"
      >
        <div className="flex flex-col min-h-[calc(100vh-10rem)]">
          <div className="container mx-auto p-4 flex-grow">
            <h1 className="text-5xl text-white mb-4">ランキング</h1>
            <div className="mx-auto h-[700px] w-[570px] pt-24 bg-[url('../../public/image/bg_ranking2.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay">
              {highScore !== null && (
                <div className=" p-4 rounded text-center">
                  <h2 className="text-white mt-2 text-xl">
                    あなたのハイスコア: {highScore}
                  </h2>
                </div>
              )}
              <table className="mx-auto w-[340px]">
                <thead>
                  <tr className="text-white">
                    <th>順位</th>
                    <th>ユーザー名</th>
                    <th>スコア</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => (
                    <tr
                      key={index}
                      className={
                        ranking.userid === session.user?.id ? "text-yellow-300" : "text-white"
                      }
                    >
                      <td className="text-center px-4 py-2">{index + 1}</td>
                      <td className="text-center px-4 py-2">{ranking.user.name}</td>
                      <td className="text-center px-4 py-2">{ranking.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
