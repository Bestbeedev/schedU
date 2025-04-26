"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  EyeOff,
  Book,
  Calendar1Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { scheduleSchema, weekSchema } from "@/zod/validation";
import { fr } from "date-fns/locale";
import { Weeks, WeekSchedule } from "@/types/tables";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/client";
import { Filiere } from "@/types/tables";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import ScheduleWeek from "@/components/layouts/ScheduleWeek";
import { getSchedulesByWeek } from "@/lib/schedule";
import { useFiltersStore } from "@/stores/filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const ScheduleSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(1)].map((_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="h-96 dark:bg-neutral-700/90  bg-neutral-200 border w-full" />
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { selectedStage, selectedDepartment } = useFiltersStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [scheduleByDay, setScheduleByDay] = useState<WeekSchedule[]>([]);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      department_id: [],
      room_id: "",
      week_id: "",
      stage_id: "",
      day_of_weeks_start: "Lundi",
      day_of_weeks_end: "Vendredi",
      start_time: "08:00",
      end_time: "13:00",
      course_name: "",
      teacher: "",
      tp: "",
      mass_horaire: "",
    },
  });

  const formWeeks = useForm<z.infer<typeof weekSchema>>({
    resolver: zodResolver(weekSchema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
    },
  });

  const [departments, setDepartments] = useState<Filiere[]>([]);
  const [stages, setStages] = useState<Filiere[]>([]);
  const [rooms, setRooms] = useState<Filiere[]>([]);
  const [weeks, setWeeks] = useState<Weeks[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const scheduleByDay = await getSchedulesByWeek();
      setScheduleByDay(scheduleByDay);
    };
    fetchData();
  }, [selectedStage, selectedDepartment]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) {
        toast.error(`Echec de recuperation des filieres, ${error.message}`)
      } else {
        setDepartments(data);
      }
    };

    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");
      if (error) {
        toast.error(`Echec de recuperation des salles de cours, ${error.message}`)
      } else {
        setRooms(data);
      }
    };

    const fetchWeeks = async () => {
      const { data, error } = await supabase.from("weeks").select("*");
      if (error) {
        toast.error(`Echec de recuperation des semaines de cours, ${error.message}`)
      } else {
        setWeeks(data);
      }
    };

    const fetchStages = async () => {
      const { data, error } = await supabase.from("stages").select("*");
      if (error) {
        toast.error(`Echec de recuperation des niveau d'etudes, ${error.message}`)
      } else {
        setStages(data);
      }
    };

    fetchDepartments();
    fetchRooms();
    fetchWeeks();
    fetchStages();
  }, [supabase]);

  const RefetchWeeks = async () => {
    const { data, error } = await supabase.from("weeks").select("*");
    if (error) {
      toast.error(`Echec de recuperation des semaines de cours, ${error.message}`)
    } else {
      setWeeks(data);
    }
  };

  async function onSubmitWeeks(values: z.infer<typeof weekSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("weeks").insert(values);
      if (error) {
        toast.error(`Erreur lors de l'insertion : ${error.message}`)
        return;
      }
    } catch (error) {
      toast.error("Erreur lors de l'insertion des données.");
    } finally {
      setIsLoading(false);
      toast.success("Semaine enregistré avec succès !");
    }
  }


  async function onSubmit(values: z.infer<typeof scheduleSchema>) {
    setIsLoading(true);
  
    try {
      const { department_id, ...otherFields } = values;
  
      const insertData = department_id.map((depId) => ({
        department_id: depId,
        ...otherFields,
      }));
  
      const { error } = await supabase.from("schedules").insert(insertData);
  
      if (error) {
        toast.error(`Erreur lors de l'insertion des données:${error.message}`);
        return;
      }
  
      toast.success("Planning enregistré avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'insertion des données.");
    } finally {
      setIsLoading(false);
    }
  }
  

  const handleReload = async () => {
    setIsLoading(true);
    try {
      const scheduleByDay = await getSchedulesByWeek();
      setScheduleByDay(scheduleByDay);
      toast.success("Données rafraîchies avec succès !");
    } catch (error) {
      toast.error("Erreur lors du rafraîchissement des données.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <header className=" dark:bg-neutral-700/70 bg-neutral-100 rounded-lg mb-5 border  ">
        <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center py-3 space-y-3 sm:space-y-0">
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto px-5">
            {user?.role === "ADMIN" && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={RefetchWeeks}
                      className=" bg-blue-500 text-white max-sm:w-full hover:bg-blue-600 transition-colors flex items-center shadow-sm"
                    >
                      <Book className="w-4 h-4" />
                      Ajouter un cours
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl dark:bg-neutral-800 h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center mx-auto">
                        Ajouter un programme
                      </DialogTitle>
                      <DialogDescription className="text-center mb-5 mx-auto">
                        Renseigner toute les informations concernant le
                        programme
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" grid items-center gap-4 grid-cols-1 md:grid-cols-2"
                      >
                        <FormField
                          control={form.control}
                          name="course_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Cours
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Reseaux Informatiques..."
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="teacher"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Enseignant
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dr Jean LOCKE"
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mass_horaire"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Masse Horaires
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="30H,15H,10H..."
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="room_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Salle de cours
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
                                    <SelectValue
                                      className="dark:text-neutral-500"
                                      placeholder="Choissisez la salle"
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-neutral-800  dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
                                    <SelectGroup className="hover:cursor-pointer">
                                      {rooms?.map((room) => (
                                        <SelectItem
                                          value={room.id}
                                          key={room.id}
                                        >
                                          {room.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="week_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Semaine de cours
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600 flex-wrap">
                                    <SelectValue placeholder="Choississez la semaine de cours" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-neutral-800  dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
                                    <SelectGroup className="hover:cursor-pointer">
                                      {weeks?.map((week) => (
                                        <SelectItem
                                          value={week.id}
                                          key={week.id}
                                        >
                                          {format(
                                            new Date(week.start_date),
                                            "EEEE d MMMM",
                                            { locale: fr }
                                          ).replace(/\b\w/g, (c) =>
                                            c.toUpperCase()
                                          )}{" "}
                                          -{" "}
                                          {format(
                                            new Date(week.end_date),
                                            "EEEE d MMMM yyyy",
                                            { locale: fr }
                                          ).replace(/\b\w/g, (c) =>
                                            c.toUpperCase()
                                          )}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stage_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Niveau
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
                                    <SelectValue placeholder="Choississez le niveau" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-neutral-800  dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
                                    <SelectGroup className="hover:cursor-pointer">
                                      {stages?.map((stage) => (
                                        <SelectItem
                                          value={stage.id}
                                          key={stage.id}
                                        >
                                          {stage.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="department_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Filières
                              </FormLabel>
                              <FormControl>
                                <div className="flex border p-3 rounded-lg flex-wrap gap-4">
                                  {departments?.map((department) => (
                                    <FormItem
                                      key={department.id}
                                      className="flex items-center space-x-0 text-start "
                                    >
                                      <Checkbox
                                        className="flex flex-wrap"
                                        checked={field.value?.includes(
                                          department.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([
                                              ...field.value,
                                              department.id,
                                            ]);
                                          } else {
                                            field.onChange(
                                              field.value.filter(
                                                (id: string) =>
                                                  id !== department.id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <FormLabel className="text-sm font-normal">
                                        {department.name}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Travaux pratiques
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="02H"
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="day_of_weeks_end"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Jour fin du cour
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
                                    <SelectValue placeholder="Fin du cours" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-neutral-800  dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
                                    <SelectGroup className="hover:cursor-pointer">
                                      {[
                                        "Lundi",
                                        "Mardi",
                                        "Mercredi",
                                        "Jeudi",
                                        "Vendredi",
                                        "Samedi",
                                      ].map((day) => (
                                        <SelectItem key={day} value={day}>
                                          {day}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="day_of_weeks_start"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Jour debut du cour
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 text-neutral-600">
                                    <SelectValue placeholder="Debut du cours" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-neutral-800  dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600">
                                    <SelectGroup className="hover:cursor-pointer">
                                      {[
                                        "Lundi",
                                        "Mardi",
                                        "Mercredi",
                                        "Jeudi",
                                        "Vendredi",
                                        "Samedi",
                                      ].map((day) => (
                                        <SelectItem key={day} value={day}>
                                          {day}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="start_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Heure du debut
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="07:00"
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="end_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Heure du fin
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="13:00"
                                  className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 placeholder:text-neutral-500 text-neutral-600"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full flex bg-green-600 cursor-pointer text-neutral-100 hover:bg-green-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-100 border-t-transparent" />
                              <span>Enregistrement en cours...</span>
                            </div>
                          ) : (
                            "Sauvegarder"
                          )}
                        </Button>
                        <DialogClose asChild>
                        <Button type="button" className="w-full flex bg-red-500 cursor-pointer text-neutral-100 hover:bg-red-600" >
                          Annuler
                        </Button>
                      </DialogClose>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className=" bg-green-600 text-white max-sm:w-full hover:bg-green-700 transition-colors flex items-center shadow-sm">
                      <Calendar1Icon className="w-4 h-4" />
                      Programmer une semaine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm dark:bg-neutral-800 h-fit overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center mx-auto">
                        Enregistrez une semiane
                      </DialogTitle>
                      <DialogDescription className="text-center mb-5 mx-auto">
                        Renseigner toute les informations concernant le la
                        semaine de cours
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={formWeeks.handleSubmit(onSubmitWeeks)}
                        className="space-y-5"
                      >
                        <FormField
                          control={formWeeks.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Date debut de la semaine
                              </FormLabel>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", {
                                          locale: fr,
                                        })
                                      ) : (
                                        <span>
                                          Choissisez la fin de la date
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    locale={fr}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formWeeks.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-neutral-200 text-neutral-700">
                                Date fin de la semaine
                              </FormLabel>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", {
                                          locale: fr,
                                        })
                                      ) : (
                                        <span>
                                          Choissisez la fin de la date
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    locale={fr}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full flex bg-green-600 cursor-pointer text-neutral-100 hover:bg-green-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-100 border-t-transparent" />
                              <span>Enregistrement en cours...</span>
                            </div>
                          ) : (
                            "Sauvegarder"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex max-sm:w-full items-center gap-2"
            >
              {showAll ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Voir filtré
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Voir tout
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center max-sm:mx-auto max-sm:w-full max-sm:justify-center gap-4 px-5">
            <Button
              onClick={handleReload}
              className="bg-blue-600 w-full text-white sm:hidden hover:bg-blue-500"
              disabled={isLoading}
            >
              <RotateCcw
                className={`text-white   ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              {isLoading ? "Rechargement en cours" : "Actualiser la page"}
            </Button>

            <Button
              onClick={handleReload}
              className="bg-blue-600 max-sm:hidden  hover:bg-blue-500"
              disabled={isLoading}
            >
              <RotateCcw
                className={`text-white ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>
      <main className="h-screen">
        <div className="">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              Planning des cours
            </h1>

            <Button
              variant="outline"
              onClick={() => setShowAllPrograms(!showAllPrograms)}
              className="flex items-center gap-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors w-full sm:w-auto"
              disabled={isLoading}
            >
              {showAllPrograms ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Voir la semaine actuelle
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Voir tous les programmes
                </>
              )}
            </Button>
          </div>

          {/* Contenu */}
          <section className="overflow-y-auto max-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]">
            {isLoading ? (
              <ScheduleSkeleton />
            ) : scheduleByDay && scheduleByDay.length > 0 ? (
              <ScheduleWeek
                schedulesByWeek={
                  showAllPrograms ? scheduleByDay : [scheduleByDay[0]]
                }
                selectedStage={selectedStage}
                selectedDepartment={selectedDepartment}
                showAll={showAll}
              />
            ) : (
              <ScheduleSkeleton />
            )}
          </section>
        </div>
      </main>
    </section>
  );
}
