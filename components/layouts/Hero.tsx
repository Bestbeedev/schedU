import GradientWrapper from "@/components/layouts/GradientWrapper";
import Image from "next/image";
import HeroImg from "@/public/images/hero.svg";
import LayoutEffect from "@/components/layouts/LayoutEffect";
import { Button } from "../ui/button";
import {  ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="custom-screen w-screen py-28">
      <LayoutEffect
        className="duration-1000 delay-300"
        isInviewState={{
          trueState: "opacity-100 translate-y-0",
          falseState: "opacity-0 translate-y-20",
        }}
      >
        <div>
          <div className="space-y-5 max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl bg-clip-text text-transparent bg-gradient-to-r font-extrabold mx-auto sm:text-6xl"
              style={{
                backgroundImage:
                  "linear-gradient(179.1deg, #FFFFFF 0.77%, rgba(255, 255, 255, 0) 182.09%)",
              }}
            >
              Consultez desormais votre programme de cours hebdomadaire en ligne
            </h1>
            <p className="max-w-xl mx-auto text-gray-300">
            schedU centralise votre emploi du temps en ligne : plus besoin de chercher dans vos mails ou groupes WhatsApp.
            Retrouvez rapidement vos cours, horaires, salles et enseignants depuis votre ordinateur ou smartphone.
            </p>
            <div className="flex justify-center font-medium text-sm">
              <Button variant={"outline"}>Voir le planning hebdomadaire<ChevronRight/></Button>
            </div>
          </div>
          <GradientWrapper
            className="mt-16 sm:mt-28 "
            wrapperclassname="max-w-3xl h-[250px] top-12 inset-0 sm:h-[300px] lg:h-[650px]"
          >
            <Image
              src={HeroImg}
              className="shadow-lg mx-auto max-w-5xl object-cover rounded-2xl"
              alt="Mailgo"
            />
          </GradientWrapper>
        </div>
      </LayoutEffect>
    </div>
  );
}
