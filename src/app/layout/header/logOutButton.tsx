import { signOut } from "../../../lib/auth";
import { Button } from "@/components/ui/button";

export default function LogOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" className="bg-[#808080] text-[#ffffff]  w-full">
        ログアウト
      </Button>
    </form>
  );
};
