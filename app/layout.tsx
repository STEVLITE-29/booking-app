
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Travel Go",
  description: "Assessment Task - Booking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="bg-background-neutral font-poppins min-h-screen">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>
        <main className="px-5 py-5 grid grid-cols-5 justify-center">
          {/* sidebar */}
          <section className="col-span-1">
            <Sidebar />
          </section>
          {/* main content */}
          <section className="col-span-4 bg-background lg:ml-7 md:ml-9 ml-10 rounded-sm p-4">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
