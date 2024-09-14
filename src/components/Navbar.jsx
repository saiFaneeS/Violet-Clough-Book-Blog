"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  ScrollText,
  Book,
  Feather,
  User,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollTop = useRef(0);
  const pathname = usePathname();

  const navItems = [
    { href: "/reviews", label: "Book Reviews", icon: ScrollText },
    { href: "/library", label: "Library", icon: Book },
    { href: "/about", label: "About the Scribe", icon: User },
    { href: "/contact", label: "Send a Missive", icon: Mail },
  ];

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop.current) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-foreground text-background p-4 fixed top-0 left-0 w-full z-50 transition-transform duration-500 delay-75 ${
        showNavbar ? "translate-y-0" : "-translate-y-20"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold"
          >
            <Shield className="h-8 w-8" />
            <span className="hidden sm:inline">Ye Olde Blog</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-foreground/10"
                    : "hover:bg-foreground/5"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive(item.href)
                  ? "bg800 text100"
                  : "hover:bg800 hover:text100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
