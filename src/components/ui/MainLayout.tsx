import React from 'react';
import Header from "../../components/Header.tsx"; // Main site header
import AdBanner from "../../components/AdBanner.tsx"; // Optional advertisement banner
import Footer from "../../components/Footer.tsx"; // Main site footer
import { Outlet } from "react-router-dom"; // Placeholder for nested route content

export const MainLayout: React.FC = () => {
  return (
    <>
      {/* Site header */}
      <Header />

      {/* Optional advertisement banner */}
      <AdBanner />

      {/* Nested route content will render here */}
      <Outlet />

      {/* Site footer */}
      <Footer />
    </>
  );
};
