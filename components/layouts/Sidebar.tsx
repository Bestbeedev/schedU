"use client";
import React from 'react'
import { usePathname } from 'next/navigation';
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  BookOpen,
  Calendar,
  ChartColumn,
  Users,
  UserRound
} from "lucide-react";
import { Button } from '../ui/button';

type navigationTypes = {
  id:number;
  label: string;
  href: string;
  icon: React.FC<any>;
};


export default function Sidebar() {
  return (
    <aside className=" items-center relative rounded-l-lg
    h-screen flex flex-col mx-auto ">
      <NavigationMenuAdmin />
    </aside>
  );
}


export const navigationLinks: navigationTypes[] = [
  { id:1,label: "Programmes", href: "/dashboard/admin", icon: Calendar },
  { id:2,label: "Enseignants", href: "#", icon: UserRound },
  { 
    id:3,
    label: "Etudiants",
    href: "/dashboard/admin/student",
    icon: Users,
  },
  {id:4, label: "Statistiques", href: "#", icon: ChartColumn },
];

export function NavigationMenuAdmin() {
    const pathname = usePathname();
  return (
    <>
      <NavigationMenu className="items-start text-sm sticky top-0">
        <NavigationMenuList className="flex flex-col gap-3 border-b pb-8">
          {navigationLinks.map((item) => {
            const isActive = pathname === item.href
            return(
            <NavigationMenuItem key={item.id} className="flex text-sm w-full">
              <Link
                  href={item.href}
                  className={`flex flex-row items-center w-full gap-3 px-3 py-2 rounded-md 
                    ${isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"} 
                    dark:text-neutral-100 transition-colors`}
                >
                  <item.icon
                    size={20}
                    className={`size-5 ${isActive ? "text-white" : ""}`}
                  />
                  <span>{item.label}</span>
                </Link>
            </NavigationMenuItem>
            )
})}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

type IconNav = {
    label: string;
    icon: React.FC<any>;
  };

export function IconNavigation({label,icon}:IconNav) {
  return (
    <>

    </>
    )}

