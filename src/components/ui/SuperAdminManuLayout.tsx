
import React from "react";
import Header from "../../components/AdminHeader.tsx";
import Footer from "../../components/AdminFooter.tsx";
import { Outlet } from "react-router-dom";

// Layout component for the admin panel, wraps page content with Header and Footer
export const AdminMenuLayout: React.FC = () => {
  return (
    <>
      <Header /> {/* Top navigation/header for admin pages */}
      <Outlet /> {/* Placeholder for nested routes content */}
      <Footer /> {/* Footer for admin pages */}
    </>
  );
};

export default AdminMenuLayout;
