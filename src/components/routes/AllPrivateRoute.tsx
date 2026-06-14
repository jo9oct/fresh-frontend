import { useAuthStore } from "../../Store/authStore";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// Protect routes for regular users
export const ProtectAuthenticationUser = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // If not authenticated, not verified, or role is not "user", redirect to home
  if (!isAuthenticated || !user?.isVerified || user.role !== "user") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render children
  return children;
};

// Protect routes for admins
export const ProtectAuthenticationAdmin = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user?.isVerified || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protect routes for super admins
export const ProtectAuthenticationSuperAdmin = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user?.isVerified || user.role !== "superAdmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirect authenticated users away from login/register pages
export const RedirectAuthentication = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user?.isVerified) {
    // Redirect based on user role
    if (user.role === "user") return <Navigate to="/" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "superAdmin") return <Navigate to="/superAdmin" replace />;
  }

  // If not authenticated, render children (e.g., login/register page)
  return children;
};
