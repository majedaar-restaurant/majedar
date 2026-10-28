"use client";

import { useContext, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShopContext } from "../contexts/ShopContext";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";

// Strictly Profile-Related Options Only
const PROFILE_AUTHENTICATED_MENU = [
  {
    href: "/my-profile",
    label: "My Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    href: "/my-orders",
    label: "My Orders",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
];

const PROFILE_GUEST_MENU = [
  {
    href: "/login",
    label: "Sign In",
    icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
  },
  {
    href: "/signup",
    label: "Register / Create Account",
    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  },
];

// Main Navigation Options (Available via Desktop Nav and Hamburger Menu)

const MAIN_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/orderanddine", label: "Order & Dine" },
  { href: "/my-orders", label: "My Orders" },
  { href: "/help", label: "Help & Support" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];


const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { setShowSearch, getCartCounts, navigate } = useContext(ShopContext);
  const { customer, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const accountRef = useRef(null);

  const isActive = (path) => pathname === path;

  const navLinkClass = (path) =>
    `transition-colors ${isActive(path) ? "text-[#1B3B2B] font-extrabold" : "hover:text-[#1B3B2B]"
    }`;

  const scrollToMenu = () => {
    const el = document.getElementById("ordering-menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/orderanddine");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  const profileMenuItems = isAuthenticated ? PROFILE_AUTHENTICATED_MENU : PROFILE_GUEST_MENU;
  const isAccountSection = profileMenuItems.some((item) =>
    pathname.startsWith(item.href)
  );

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
        {/* Left: Brand Logo & 100% PURE VEG Badge */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          <Link href="/" className="flex items-center group py-1" aria-label="Majedaar Restaurant Home">
            <Logo variant="full" className="h-9 sm:h-11 w-auto" />
          </Link>

          {/* Clearly visible & professionally designed 100% PURE VEG label */}
          <div
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-600/40 text-emerald-800 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase shadow-2xs select-none"
            title="Majedaar is a 100% Pure Vegetarian Restaurant"
            aria-label="100% Pure Vegetarian"
          >
            <span className="w-3.5 h-3.5 rounded-xs border border-emerald-700 flex items-center justify-center bg-white p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
            </span>
            <span className="whitespace-nowrap font-black">100% PURE VEG</span>
          </div>
        </div>

        {/* Center: Desktop Navigation (Main links) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link href="/orderanddine" className={navLinkClass("/orderanddine")}>
            Order &amp; Dine
          </Link>
          <Link href="/contact" className={navLinkClass("/contact")}>
            Contact
          </Link>
          <Link href="/help" className={navLinkClass("/help")}>
            Help
          </Link>
          <Link href="/faqs" className={navLinkClass("/faqs")}>
            FAQs
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <button
            onClick={() => {
              setShowSearch(true);
              const searchInput = document.getElementById("homepage-search-input");
              if (searchInput) {
                searchInput.focus();
              } else {
                navigate("/orderanddine");
              }
            }}
            className="p-2 rounded-full text-stone-600 hover:text-[#1B3B2B] hover:bg-stone-200/60 transition-colors"
            title="Search dishes"
            aria-label="Search dishes"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full text-stone-600 hover:text-[#1B3B2B] hover:bg-stone-200/60 transition-colors"
            aria-label="Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {getCartCounts() > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center bg-[#C85A17] text-white text-[10px] font-bold w-4 h-4 rounded-full">
                {getCartCounts()}
              </span>
            )}
          </Link>

          {/* Profile Icon & Strictly Profile-Related Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((prev) => !prev)}
              className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${isAccountSection || accountOpen
                ? "text-[#1B3B2B] bg-stone-200/60"
                : "text-stone-600 hover:text-[#1B3B2B] hover:bg-stone-200/60"
                }`}
              aria-label="Profile and account menu"
              aria-expanded={accountOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {isAuthenticated && customer?.name && (
                <span className="hidden lg:inline text-xs font-bold text-[#1B3B2B] max-w-[100px] truncate">
                  {customer.name.split(" ")[0]}
                </span>
              )}
            </button>

            {/* Profile Dropdown Panel (Strictly Profile/Account Options Only) */}
            {accountOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#FAF8F5] border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 pt-3.5 pb-2.5 border-b border-stone-100 bg-stone-50/50">
                  {isAuthenticated ? (
                    <div>
                      <p className="text-xs font-bold text-[#1B3B2B] truncate">
                        {customer?.name}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {customer?.email}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Welcome to Majedaar
                      </p>
                      <p className="text-xs font-semibold text-stone-700 mt-0.5">
                        Guest Customer
                      </p>
                    </div>
                  )}
                </div>

                <div className="py-1.5">
                  {profileMenuItems.map(({ href, label, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAccountOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-colors ${pathname === href
                        ? "text-[#1B3B2B] bg-stone-100"
                        : "text-stone-700 hover:text-[#1B3B2B] hover:bg-stone-100/80"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-none text-stone-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                      </svg>
                      <span>{label}</span>
                    </Link>
                  ))}

                  {/* Sign Out option if authenticated */}
                  {isAuthenticated && (
                    <div className="pt-1 mt-1 border-t border-stone-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left"
                      >
                        <svg
                          className="w-4 h-4 flex-none text-rose-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Now button — desktop only */}
          <button
            onClick={scrollToMenu}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1B3B2B] text-white text-xs font-bold tracking-wide uppercase hover:bg-[#11261B] active:scale-95 transition-all shadow-2xs"
          >
            Order Now
          </button>

          {/* Mobile Hamburger Menu Icon (Hosts All Main Navigation Options) */}
          <button
            onClick={() => setVisible(true)}
            className="p-2 rounded-lg md:hidden text-stone-600 hover:bg-stone-200/60 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer (All Navigation Options) */}
        <div
          className={`fixed z-[9999] top-0 right-0 h-dvh w-80 max-w-[90vw] bg-[#FAF8F5] shadow-2xl transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full text-stone-800 p-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <button
                onClick={() => setVisible(false)}
                className="p-1 rounded-md text-stone-500 hover:text-stone-800"
                aria-label="Close Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex-1 pt-2 flex flex-col gap-1 text-sm font-medium overflow-y-auto">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-1">
                Navigation
              </p>
              {MAIN_NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setVisible(false)}
                  className={`py-2.5 px-3 rounded-lg transition-colors ${pathname === href
                    ? "bg-[#1B3B2B] text-white font-bold"
                    : "text-stone-700 hover:bg-stone-200/60"
                    }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Bottom Drawer CTA */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  setVisible(false);
                  scrollToMenu();
                }}
                className="w-full py-2.5 rounded-lg bg-[#1B3B2B] text-white text-xs font-bold uppercase tracking-wider text-center"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;