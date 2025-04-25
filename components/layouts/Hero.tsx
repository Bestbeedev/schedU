"use client"
import GradientWrapper from "@/components/layouts/GradientWrapper";
import Image from "next/image";
import HeroImg from "@/public/images/hero.svg";
import LayoutEffect from "@/components/layouts/LayoutEffect";
import { Button } from "../ui/button";
import {  ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router=useRouter()
    const handleDashboard=()=>{
        router.push("/dashboard")
    }
  return (
    <div className="custom-screen w-full px-4 py-20 sm:py-28">
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
            className="text-3xl sm:text-5xl lg:text-6xl bg-clip-text text-transparent font-extrabold leading-tight"
            style={{
              backgroundImage:
                "linear-gradient(179.1deg, #FFFFFF 0.77%, rgba(255, 255, 255, 0) 182.09%)",
            }}
          >
            Consultez votre programme de cours hebdomadaire en ligne
          </h1>
  
          <p className="max-w-xl mx-auto text-gray-300 text-base sm:text-lg">
            schedU centralise votre emploi du temps : fini les mails perdus ou les messages WhatsApp. Retrouvez vos cours, horaires, salles et enseignants à tout moment, sur tous vos appareils.
          </p>
  
          <div className="flex justify-center">
            <Button
              onClick={handleDashboard}
              variant={"outline"}
              className="flex items-center gap-1"
            >
              Voir le planning hebdomadaire <ChevronRight />
            </Button>
          </div>
        </div>
  
        <GradientWrapper
          className="mt-14 sm:mt-24"
          wrapperclassname="max-w-3xl h-[200px] top-12 inset-0 sm:h-[300px] lg:h-[600px]"
        >
          <Image
            src={HeroImg}
            alt="Aperçu du planning"
            className="shadow-lg mx-auto w-full max-w-5xl object-cover rounded-2xl"
          />
        </GradientWrapper>
      </div>
    </LayoutEffect>
  </div>
  
  );
}
