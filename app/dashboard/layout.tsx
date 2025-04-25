"use client"
import React from 'react';
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'next/navigation'
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import Loading from '@/components/layouts/Loading';


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuthStore()
  const router = useRouter()
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) return <Loading/>
  return (
      <section className="dark:bg-neutral-900 overflow-y-hidden  bg-white justify-center flex flex-col border dark:border-neutral-700 shadow-xl border-neutral-200 min-h-screen w-full overflow-hidden">
        <Header />
        <section className="bg-neutral-100 dark:bg-neutral-800/90 min-h-screen  sticky top-0 flex w-screen">
          <aside className="max-w-sm py-6 px-4 border-r hidden" >
            <Sidebar/>
          </aside>
          <main className="flex-1 overflow-y-hidden bg-neutral-50 p-6 max-md:px-4 dark:dark:bg-neutral-800">{children}</main>
        </section>
      </section>
  );
}


