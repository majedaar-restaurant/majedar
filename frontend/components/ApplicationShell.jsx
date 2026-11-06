"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Searchbar from "./Searchbar";
import StickyCartBar from "./StickyCartBar";
import BrandedLoader from "./BrandedLoader";
import ShopStatusBanner from "./ShopStatusBanner";
import ScrollToTopHandler from "./ScrollToTopHandler";
import MandatoryPhoneModal from "./MandatoryPhoneModal";

export default function ApplicationShell({ children }) {
  const isRiderRoute = usePathname()?.startsWith("/rider");

  return (
    <>
      {!isRiderRoute && <MandatoryPhoneModal />}
      {!isRiderRoute && <BrandedLoader />}
      {!isRiderRoute && <ScrollToTopHandler />}
      <div className="flex flex-col flex-1">
        {!isRiderRoute && <ShopStatusBanner />}
        {!isRiderRoute && <Navbar />}
        {!isRiderRoute && <Searchbar />}
        <main className="flex-1">{children}</main>
      </div>
      {!isRiderRoute && <StickyCartBar />}
      {!isRiderRoute && <Footer />}
    </>
  );
}
