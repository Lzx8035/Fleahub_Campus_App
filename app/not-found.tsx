import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold mt-28">
        This page could not be found :(
      </h1>
      <Button asChild>
        <Link href="/login">Go back home</Link>
      </Button>
    </main>
  );
}
