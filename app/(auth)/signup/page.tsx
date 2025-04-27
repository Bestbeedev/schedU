"use client";
"use client";

import { useRouter } from "next/navigation";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/zod/validation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import google from "@/public/images/google.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { createClient } from "@/lib/client";
import Link from "next/link";

export default function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setUser, setIsLoading: setAuthLoading } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setIsLoading(true);
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          role: data.user.email === "josueaoga0@gmail.com" ? "ADMIN" : "USER",
        });
        toast.success("Inscription réussie ! Vérifiez votre email.");
        return router.push("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast.error("Erreur avec Google : " + error.message);
    }
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-md h-fit  justify-center my-auto mx-auto max-sm:mx-4  p-6 rounded-xl shadow-md border dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-none dark:text-white">
      <CardHeader className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold dark:border-neutral-100 tracking-tight">
          Créer un compte
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-400">
          Entrez vos informations ci-dessous pour créer votre compte
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-neutral-200 text-neutral-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-neutral-200 text-neutral-700">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="........."
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
              className="w-full bg-green-600 cursor-pointer text-neutral-100 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-100 border-t-transparent" />
                  <span>Inscription en cours...</span>
                </div>
              ) : (
                "S'inscrire"
              )}
            </Button>

            <div className="text-center text-sm text-neutral-700 dark:text-neutral-400">
              ou
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full dark:border-neutral-700 dark:text-neutral-100 flex items-center justify-center gap-2"
              onClick={handleGoogleSignUp}
            >
              <Image src={google} alt="google icon" className="h-6 w-6" />
              Continuer avec Google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm dark:text-neutral-300 text-neutral-700">
          Pas encore un compte ?{" "}
          <Link
            href={"/login"}
            className="dark:text-neutral-200 cursor-pointer dark:hover:text-green-500 hover:text-red-500 underline"
          >
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
