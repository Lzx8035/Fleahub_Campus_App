"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 保存上一次的 URL
    const prevUrl = sessionStorage.getItem("prevUrl");
    const currentUrl = `${pathname}?${searchParams}`;

    // 只有在实际的页面跳转时才滚动到顶部
    if (prevUrl && prevUrl !== currentUrl) {
      window.scrollTo(0, 0);
    }

    // 更新保存的 URL
    sessionStorage.setItem("prevUrl", currentUrl);
  }, [pathname, searchParams]);

  return null;
}
