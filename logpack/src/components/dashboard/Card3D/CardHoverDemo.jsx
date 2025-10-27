import { HoverEffect } from "./card-hover-effect";
import { Heart, Warehouse, ShoppingBag, Briefcase } from "lucide-react";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    id: "1",
    title: "178+",
    description: "Save Products",
    link: "#",
    icon: <Heart className="h-6 w-6 text-chart-5" />,
    cardClass: "bg-chart-4 from-purple-400 to-purple-600 text-white",
  },
  {
    id: "2",
    title: "20+",
    description: "Stock Products",
    link: "#",
    icon: <Warehouse className="h-6 w-6 text-chart-5" />,
    cardClass: "bg-chart-3 from-blue-200 to-blue-600 text-white",
  },
  {
    id: "3",
    title: "190+",
    description: "Sales Products",
    link: "#",
    icon: <ShoppingBag className="h-6 w-6 text-chart-5" />,
    cardClass: "bg-chart-2 from-pink-600 to-pink-600 text-white",
  },
  {
    id: "4",
    title: "12+",
    description: "Job Application",
    link: "#",
    icon: <Briefcase className="h-6 w-6 text-chart-5" />,
    cardClass: "bg-chart-1 from-orange-400 to-orange-600 text-white",
  },
];