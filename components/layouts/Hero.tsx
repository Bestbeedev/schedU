"use client"
import GradientWrapper from "@/components/layouts/GradientWrapper";
import Image from "next/image";
import schedu from "@/public/images/schedu.png";
import LayoutEffect from "@/components/layouts/LayoutEffect";
import { Button } from "../ui/button";
import {  ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="custom-screen bg-neutral-900 w-full px-4 py-20 sm:py-28">
    <LayoutEffect
      className="duration-1000 delay-300"
      isInviewState={{
        trueState: "opacity-100 translate-y-0",
        falseState: "opacity-0 translate-y-20",
      }}
    >
      <div>
        <div className="space-y-6 max-w-3xl mx-auto text-center">
          <h1
            className="text-3xl pb-2 sm:text-5xl lg:text-6xl bg-clip-text text-transparent font-extrabold "
            style={{
              backgroundImage:
                "linear-gradient(179.1deg, #FFFFFF 0.77%, rgba(255, 255, 255, 0) 182.09%)",
            }}
          >
            Consultez votre programme de cours hebdomadaire en ligne
          </h1>
  
          <p className="max-w-xl text-sm mx-auto text-gray-300   sm:text-base">
          Bienvenue sur schedU – votre emploi du temps, clair et accessible, partout.
          Suivez vos cours semaine après semaine grâce à une interface intuitive et toujours à jour. Fini les informations dispersées : retrouvez en un clin d'œil vos horaires, salles et enseignants, depuis n’importe quel appareil.
          </p>
  
          <div className="flex justify-center">
            <Link href={"/dashboard"}>
            <Button
              variant={"outline"}
              className="flex items-center gap-1"
            >
              Voir le planning hebdomadaire <ChevronRight />
            </Button>
            </Link>
          </div>
        </div>
  
        <GradientWrapper
          className="mt-10 sm:mt-18"
          wrapperclassname="max-w-3xl h-[200px] top-12 inset-0 sm:h-[300px] lg:h-[600px]"
        >
          <div className="bg-neutral-700/80 rounded-2xl p-3 mx-auto border w-fit h-fit">
          <Image
            src={schedu}
            alt="Aperçu du planning"
            className="shadow-lg mx-auto w-full max-w-5xl object-cover rounded-2xl"
          />
          </div>
        </GradientWrapper>
      </div>
    </LayoutEffect>
  </div>
  
  );
}
