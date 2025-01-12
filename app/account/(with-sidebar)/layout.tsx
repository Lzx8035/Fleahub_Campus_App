import SideNav from "@/app/_components/SideNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* 固定侧边栏 */}
        <div className="fixed">
          <SideNav />
        </div>
        {/* 占位，防止内容被固定的侧边栏覆盖 */}
        <div className="w-64 shrink-0" />
        {/* 可滚动的内容区域 */}
        <main className="flex-1 min-h-[500px]">{children}</main>
      </div>
    </div>
  );
}
