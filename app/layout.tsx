import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";

export const metadata = {
  title: {
    template: "%s | Fleahub Campus",
    default: "Welcome | Fleahub Campus",
  },
  description:
    "FleaHubU is a dedicated online marketplace designed specifically for university students to buy and sell second-hand items within their campus community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
