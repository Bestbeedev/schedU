
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <section className="dark:bg-neutral-900 bg-white justify-center flex border dark:border-neutral-700 shadow-xl border-neutral-200 min-h-screen w-full overflow-hidden">
            {children}
        </section>
  );
}
