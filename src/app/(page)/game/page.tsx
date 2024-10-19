import PlayArea from "@/app/components/game/playArea";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (!session || !session.user?.id) return null;
return(
  <PlayArea userId={session.user?.id}/>
);
}
