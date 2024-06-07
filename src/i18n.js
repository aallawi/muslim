import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "./locale/en.json";
import translationAR from "./locale/ar.json";

const defaultLanguage = localStorage.getItem("i18nextLng") || "en";

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    // fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
  });
