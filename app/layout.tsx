import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Travel Go",
  description: "Assessment Task - Booking App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} bg-background-neutral min-h-screen`}
      >
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        <main
          className="
            px-5
            py-5
            flex
            flex-col
            lg:grid
            lg:grid-cols-[260px_1fr]
            gap-6
          "
        >
          {/* Sidebar */}
          <section>
            <Sidebar />
          </section>

          {/* Main Content */}
          <section
            className="
              bg-background
              rounded-sm
              min-h-[calc(100vh-140px)]
            "
          >
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
