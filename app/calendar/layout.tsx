'use client'

import { useIsSidebarOpen } from "@/stores/useSidebarStore";
import Sidebar from "@/conponents/Sidebar";
import { cn } from "@/lib/utils";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isOpen = useIsSidebarOpen();


  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center p-8 bg-white">
      <Sidebar />
      <main className={cn("transition-all duration-300 pt-20 mt-60",isOpen ? 'md:pl-64' : '')}>
        {children}
      </main>
      
    </div>
  );
}
