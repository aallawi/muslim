import { useEffect } from "react";
import { Routers } from "./Routers/Routers";
import { useLocation } from "react-router";
import i18next from "i18next";
import "./index.css";

function App() {
  const { pathname } = useLocation();
  const currentLanguage = i18next.language;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const currentLanguage = i18next.language;
    import(`./style/${currentLanguage}.css`);
  }, [currentLanguage]);

  return (
    <div className="Background">
      <Routers />
    </div>
  );
}

export default App;
