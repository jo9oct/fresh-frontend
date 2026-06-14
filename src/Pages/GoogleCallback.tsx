import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/authStore";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/google/me", {
          method: "GET",
          credentials: "include", // send cookie
        });
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          setAuthenticated(true);
          navigate("/"); // dashboard or homepage
        } else {
          navigate("/User/Login");
        }
      } catch {
        navigate("/User/Login");
      }
    };

    fetchUser();
  }, [setUser, setAuthenticated, navigate]);

  return <p>Logging you in with Google...</p>;
};

export default GoogleCallback;
