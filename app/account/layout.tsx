import SideNav from "../_components/SideNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <SideNav />
        <main className="flex-1 min-h-[500px]">{children}</main>
      </div>
    </div>
  );
}
