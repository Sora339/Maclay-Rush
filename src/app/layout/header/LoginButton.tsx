import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import Image from "next/image";

export default function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/myPage" });
      }}
    >
      <Button type="submit">
        <Image
          src="image/login.svg"
          alt="google"
          width={200}
          height={40}
          className="rounded-full"
        ></Image>
      </Button>
    </form>
  );
}
