import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import childPray from "../assets/images/child-pray.webp";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import allMethod from "../assets/data/allMethod";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate() - 1; // لأن الاندكس يبدأ من 0

  const [latitude, setLatitude] = useState(localStorage.getItem("latitude"));
  const [longitude, setLongitude] = useState(localStorage.getItem("longitude"));
  const [method, setMethod] = useState(null); // تم تعديل القيمة الافتراضية إلى null
  const [city, setCity] = useState(localStorage.getItem("selectedCity"));
  const [data, setData] = useState(null);
  const [allTimes, setAllTimes] = useState({});
  const [holiday, setHoliday] = useState("");

  const monthsArabic = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const allOptions = useMemo(() => {
    return allMethod.map((method) => ({
      value: method.value,
      label: currentLanguage === "en" ? method.labelEn : method.labelAr,
    }));
  }, [allMethod, currentLanguage]);

  const HandelSelectedMethod = (selectedOption) => {
    setMethod(selectedOption.value);
  };

  // Set geolocation coordinates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch city data
  useEffect(() => {
    if (latitude && longitude && method) {
      axios
        .get(
          `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`
        )
        .then((response) => {
          const result = response.data;
          setData(result.data);
          setAllTimes(result.data[day].timings);
          setCity(data[day].meta.timezone.replace(/^[^/]+\//, ""));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [year, month, latitude, longitude, day, method]);

  // Convert time to "hh:mm AM/PM" format
  const convertTimeFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const suffix = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute.split(" ")[0]} ${suffix}`;
  };

  // Check for Islamic holidays
  useEffect(() => {
    if (data?.[day]?.date?.hijri?.holidays) {
      const holidays = data[day].date.hijri.holidays;
      if (holidays.length > 0) {
        setHoliday(holidays.join(" - "));
      }
    }
  }, [data, day]);

  // Use useMemo to filter only five prayer times
  const prayerTimes = useMemo(() => {
    return ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => ({
      [prayer]: convertTimeFormat(allTimes[prayer]),
    }));
  }, [allTimes]);

  const changePath = (path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen pt-[80px] overflow-hidden">
      {/* part One */}
      <div className="flex flex-col justify-center">
        <h2 className="mb-[30px] text-center text-[40px] font-[700]">
          {t("prayer-times")}
        </h2>
        <button
          className=" bg-green-400 p-[10px] mb-[20px] text-[23px] font-[600]"
          onClick={() => changePath("/city")}
        >
          Choose the location manually
        </button>
        <div>
          <Select
            placeholder="اختر طريقة حساب أوقات الصلاة"
            onChange={HandelSelectedMethod}
            options={allOptions}
          />
        </div>
        <div className="flex justify-around font-[600] text-[18px] mb-[40px]">
          {/* city - day */}
          <div className="">
            <h2 className="mb-[15px]">{city}</h2>
            <h2>
              {currentLanguage === "en"
                ? data?.[day]?.date?.gregorian?.weekday.en
                : data?.[day]?.date?.hijri?.weekday.ar}
            </h2>
          </div>
          {/* date */}
          <div className="">
            <h2 className="mb-[15px]">
              {currentLanguage === "en" ? (
                data?.[day]?.date?.readable
              ) : (
                <div className="flex gap-1">
                  <span>{data?.[day]?.date?.gregorian?.day}</span>
                  <span>{monthsArabic[month - 1]}</span>
                  <span>{year}</span>
                </div>
              )}
            </h2>
            <h2 className="flex gap-1">
              <span>{data?.[day]?.date?.hijri?.day}</span>

              <span>
                {currentLanguage === "en"
                  ? data?.[day]?.date?.hijri?.month.en
                  : data?.[day]?.date?.hijri?.month.ar}
              </span>
              <span>{data?.[day]?.date?.hijri?.year}</span>
            </h2>
          </div>
        </div>

        {/* holidays */}
        {holiday && (
          <div className=" mt-[30px] text-center text-red-800 text-[40px] font-[600]">
            Today is {holiday}
          </div>
        )}

        {/* timeRemaining */}
        {/* <div className="text-center my-[40px] ">
          <p className="mb-[20px] text-[25px] font-[600] animate-pulse">
            {t("next-prayer")}
            <span>{nextPrayer}</span>
          </p>
          <h2 className="flex justify-center gap-[15px] text-[30px]">
            {t("remaining-time")}
            <span className="text-red-500">{timeRemaining}</span>
          </h2>
        </div> */}
      </div>

      {/* part two */}
      <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
        {/* img */}
        <div className=" hidden xl:block flex-1 md:h-[310px] w-[80%] max-w-[500px]">
          <img
            src={childPray}
            className="object-cover h-full w-full rounded-[6px]"
            alt="Child Pray"
          />
        </div>

        {/* prayer times */}
        <div className="flex-1 py-[16px] bg-primary text-secondary rounded-[6px] w-[80%] max-w-[500px]">
          <div className="flex px-[20px] justify-between font-[700] text-[18px] pb-[16px] border-b-[2px] border-secondary">
            <div className="">{t("name-of-salat")}</div>
            <div className="">{t("azan-time")}</div>
          </div>
          {prayerTimes.map((time, index) => (
            <div
              key={index}
              className={`flex justify-between font-[700] text-[16px] px-[20px] ${
                index === prayerTimes.length - 1
                  ? "pt-[12px]"
                  : "py-[12px] border-b border-solid border-secondary"
              }`}
            >
              <div>{t(Object.keys(time)[0])}</div>
              <div>{Object.values(time)[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;

// -------------------------------------------------------
// const timestamp = data?.[day].date.timestamp;
// console.log(new Date(timestamp * 1000).toUTCString());

// -----------------------------------------------------
// Calculate time remaining until the next prayer
// const calculateTimeRemaining = () => {
//   const now = new Date();
//   const times = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
//   for (let i = 0; i < times.length; i++) {
//     const prayerTime = allTimes[times[i]];
//     if (prayerTime) {
//       const [hours, minutes] = prayerTime.split(":").map(Number);
//       const prayerDate = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate(),
//         hours,
//         minutes
//       );
//       if (prayerDate > now) {
//         const diff = prayerDate - now;
//         const diffHours = Math.floor(diff / (1000 * 60 * 60));
//         const diffMinutes = Math.floor(
//           (diff % (1000 * 60 * 60)) / (1000 * 60)
//         );
//         setNextPrayer(times[i]);
//         setTimeRemaining(`${diffHours} ساعة و ${diffMinutes} دقيقة`);
//         return;
//       }
//     }
//   }
//   // If no upcoming prayer today, consider tomorrow's Fajr
//   const [fajrHours, fajrMinutes] = allTimes["Fajr"]
//     ? allTimes["Fajr"].split(":").map(Number)
//     : [0, 0];
//   const tomorrowFajr = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate() + 1,
//     fajrHours,
//     fajrMinutes
//   );
//   const diff = tomorrowFajr - now;
//   const diffHours = Math.floor(diff / (1000 * 60 * 60));
//   const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   setNextPrayer("Fajr");
//   setTimeRemaining(`${diffHours} ساعة و ${diffMinutes} دقيقة`);
// };
