
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center p-8 bg-white">
      {children}
    </div>
  );
}
