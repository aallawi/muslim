import { useEffect } from "react";
import { Routers } from "./Routers/Routers";
import i18next from "i18next";
import "./index.css";

function App() {
  const currentLanguage = i18next.language;

  useEffect(() => {
    const currentLanguage = i18next.language;
    import(`./style/${currentLanguage}.css`);
  }, [currentLanguage]);

  return (
    <div className=" bg-body">
      <Routers />
    </div>
  );
}

export default App;
