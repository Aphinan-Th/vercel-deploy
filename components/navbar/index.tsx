"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  sectionRefs: {
    [key: string]: React.RefObject<HTMLDivElement>;
  };
}

export default function Navbar({ sectionRefs }: NavbarProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const goToSection = (section: string) => {
    sectionRefs[section].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 100));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-white sticky top-0 z-10 p-4 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-blue-400 text-xl font-bold">Cephalometric</div>
        <ul className="flex space-x-4 items-center">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => goToSection(item.toLowerCase())}
                className="text-black hover:text-blue-400"
              >
                {item}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => router.push("/diagnosis")}
              className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5"
            >
              Start Diagnosis
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
