"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { createClient } from "@/lib/client";
import { useFiltersStore } from "@/stores/filters";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, LogOut } from "lucide-react";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const { showAll } = useFiltersStore();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ Erreur de déconnexion :", error.message);
      return;
    }
    useAuthStore.getState().setUser(null);
    toast.success("Deconnexion reussie");
    router.push("/login");
  };

  return (
    <header className="flex bg-white dark:bg-neutral-800 sticky top-0 justify-between px-6 py-4 border-t border border-b">
      <section className="flex gap-1 items-center">
        <Calendar className="size-5" />
        <h1 className="text-xl font-semibold text-green-500">SchedU</h1>
        <Badge variant={'outline'} className="text-sm">
          v.1.0.0
        </Badge>
      </section>
      <section className="flex gap-2">
        <SelectFiliere disabled={showAll} />
        <SelectGrade disabled={showAll} />
      </section>
      <section className="flex gap-3">
        <ModeToggle />
        <AvatarUser />
        <Button className="cursor-pointer" onClick={handleLogout}>
          <LogOut /> Logout
        </Button>
      </section>
    </header>
  );
}

export function SelectFiliere({ disabled = false }: { disabled?: boolean }) {
  const [departments, setDepartments] = useState<Filiere[]>([]);
  const { selectedDepartment, setSelectedDepartment } = useFiltersStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setDepartments(data);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={disabled}>
      <SelectTrigger className="w-[150px] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
        <SelectValue placeholder="Filiere:" />
      </SelectTrigger>
      <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
        <SelectGroup className="hover:cursor-pointer">
          <SelectLabel>Choix de filiere</SelectLabel>
          {departments?.map((fil) => (
            <SelectItem key={fil.id} className="cursor-pointer" value={fil.name}>
              {fil.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SelectGrade({ disabled = false }: { disabled?: boolean }) {
  const [niveau, setNiveau] = useState<Filiere[]>([]);
  const { selectedStage, setSelectedStage } = useFiltersStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchNiveau = async () => {
      const { data, error } = await supabase.from("stages").select("*");
      if (error) {
        console.error("Error fetching stages:", error);
      } else {
        setNiveau(data);
      }
    };
    fetchNiveau();
  }, []);

  return (
    <Select value={selectedStage} onValueChange={setSelectedStage} disabled={disabled}>
      <SelectTrigger className="w-[150px] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
        <SelectValue placeholder="Niveau:" />
      </SelectTrigger>
      <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
        <SelectGroup className="hover:cursor-pointer">
          <SelectLabel>Niveau</SelectLabel>
          {niveau?.map((niv) => (
            <SelectItem key={niv.id} className="cursor-pointer" value={niv.name}>
              {niv.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarUser() {
  const { user } = useAuthStore();
  return (
    <Avatar className="">
      {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
      <AvatarFallback className="dark:bg-red-600 text-neutral-50 bg-blue-600">
        {user?.email.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Filiere } from "@/types/tables";
import { Badge } from "../ui/badge";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
