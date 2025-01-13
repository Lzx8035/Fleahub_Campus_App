import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Campus Shopping Made Easy
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 mt-8 max-w-2xl">
        Buy and sell second-hand items safely within your campus community
      </p>

      <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-2xl">
        Save Money from today
      </p>

      <div className="space-x-4">
        <Button asChild size="lg" className="bg-[#40cfd7] hover:bg-[#2fb8bf]">
          <Link href="/items">Start Browsing</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}
