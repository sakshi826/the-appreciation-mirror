import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      window.location.href = "/token";
    }
  }, [navigate]);

  if (!sessionStorage.getItem("user_id")) {
    return null; // Will redirect shortly
  }

  return <>{children}</>;
};
