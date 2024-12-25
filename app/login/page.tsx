import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full h-full max-w-sm mt-16">
        <LoginForm />
      </div>
    </div>
  );
}
