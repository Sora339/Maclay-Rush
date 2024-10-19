import LoginButton from "@/app/layout/header/LoginButton";
import Footer from "@/app/layout/footer/footer";
import AuthHeader from "./header";

const Login = () => {
  return (
    <div className="bg-[url('../../public/image/bg-top.webp')] bg-cover bg-[rgba(0,0,0,0.60)] bg-blend-overlay h-[100vh]">
      <div
        className="flex flex-col min-h-screen"
        style={{ scrollbarGutter: "stable" }}
      >
        <AuthHeader />
        <div className="container mx-auto h-[calc(100vh-80px-80px)]">
          <div className="flex h-full items-center justify-center">
            <div>
              <h2 className="mb-7 text-white text-center text-[30px] font-bold">
                さあ、まだ見ぬ本の世界へ
              </h2>
              <div className="mb-[50px] flex justify-center">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
