import React from "react";
import Header from "../../components/AdminHeader.tsx"; // Import admin header
import Footer from "../../components/AdminFooter.tsx"; // Import admin footer
import AdminDashboardElements from "./AdminDashboardElements.tsx"; // Import admin navigation/dashboard elements
import { Outlet } from "react-router-dom"; // Import Outlet to render nested routes

export const AdminMenuLayout: React.FC = () => {
  return (
    <>
      <style>{`
        .admin-dashboard {
          padding: 2rem; /* Add padding around dashboard content */
          max-width: 1400px; /* Limit maximum width */
          margin: 0 auto; /* Center horizontally */
        }

        .dashboard-outlet {
          margin-top: 2rem; /* Space between nav and main content */
          margin-bottom: 2rem; /* Space before footer */
        }

      `}</style>
      <Header /> {/* Render admin header */}
      <div className="admin-dashboard">
        <AdminDashboardElements /> {/* Render admin navigation/sidebar */}
        <div className="dashboard-outlet">
          <Outlet /> {/* Render nested admin routes here */}
        </div>
      </div>
      <Footer /> {/* Render admin footer */}
    </>
  )
};

export default AdminMenuLayout; // Export admin layout component
