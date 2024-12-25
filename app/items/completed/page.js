import Link from "next/link";

export default function Page() {
  return (
    <div className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold mt-28">
        Thank you for your shopping!
      </h1>
      <Link
        href="/account/orders"
        className="underline text-xl text-accent-500 inline-block"
      >
        Manage your appointment &rarr;
      </Link>
    </div>
  );
}
