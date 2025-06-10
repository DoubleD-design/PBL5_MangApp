import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code) {
      authService.exchangeGoogleCodeForJwt(code, state)
        .then(() => navigate("/"))
        .catch(() => navigate("/login"));
    }
  }, [location, navigate]);

  return <div>Authenticating with Google...</div>;
};

export default GoogleCallback;