import { Calendar, Filter, SunIcon } from "lucide-react"
import Image from "next/image"
import schedu2 from "@/public/images/schedu2.png"

const features = [
  {
    name: 'Organisation Hebdomadaire Simplifiée:',
    description:
      "Consultez votre programme de cours semaine par semaine, présenté de manière claire et structurée. Ne manquez plus jamais une session grâce à une vue d’ensemble actualisée régulièrement.",
    icon: Calendar,
  },
  {
    name: 'Filtrage Intelligent par Filière et Niveau:',
    description: "Accédez rapidement aux cours qui vous concernent en filtrant selon votre filière et votre niveau d’études. Gagnez du temps et focalisez-vous uniquement sur les informations essentielles pour votre parcours.",
    icon: Filter,
  },
  {
    name: 'Expérience Personnalisée : Mode Clair & Sombre :',
    description: "Adaptez l'interface à votre confort visuel : basculez facilement entre le mode clair et le mode sombre selon vos préférences ou l’éclairage ambiant. Étudiez sans effort, de jour comme de nuit.",
    icon: SunIcon,
  },
]

export default function Features() {
  return (
    <div className="overflow-hidden bg-neutral-800 border-t border-neutral-700 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:-pt-2 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-green-600">Découvrez les</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-neutral-100 sm:text-5xl">
              Fonctionnalités clés de notre plateforme
              </p>
              <p className="mt-6 text-sm text-neutral-300">
              Découvrez des fonctionnalités pensées pour faciliter votre vie étudiante : consultez votre programme, filtrez-le selon votre parcours, et personnalisez votre interface pour un confort optimal.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-sm text-neutral-50 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold  text-green-500">
                      <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-blue-500" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline text-sm">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
           width={2432}
           height={1842}
            src={schedu2}
            alt="Aperçu du dashboard features schedu"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}
