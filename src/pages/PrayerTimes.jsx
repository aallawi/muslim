import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import childPray from "../assets/images/child-pray.webp";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import allMethod from "../assets/data/allMethod";
import { PuffLoader } from "react-spinners";
import { MagnifyingGlass } from "react-loader-spinner";

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
  const [method, setMethod] = useState(localStorage.getItem("method") || 5);
  const [city, setCity] = useState(localStorage.getItem("selectedCity"));
  const [data, setData] = useState(null);
  const [allTimes, setAllTimes] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState(null);
  const [remainingTime, setRemainingTime] = useState({
    hours: null,
    minutes: null,
  });
  const [holiday, setHoliday] = useState("");
  const [loading, setLoading] = useState(true);

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
    localStorage.setItem("method", selectedOption.value);
  };

  // Set geolocation coordinates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          !longitude && setLatitude(position.coords.latitude);
          !latitude && setLongitude(position.coords.longitude);
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
      setLoading(true);
      axios
        .get(
          `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`
        )
        .then((response) => {
          const result = response.data;
          setData(result.data);
          setAllTimes(result.data[day].timings);
          !city &&
            setCity(result.data[day].meta.timezone.replace(/^[^/]+\//, ""));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [year, month, latitude, longitude, day, method]);

  // Convert time to "hh:mm AM/PM" format
  const convertTimeFormat = (time) => {
    if (!time) return "";
    const cleanedTime = time.replace(/\s*\([^)]*\)/g, "");
    const [hour, minute] = cleanedTime.split(":");
    const hourNum = parseInt(hour, 10);
    const suffix = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  // Check for Islamic holidays
  useEffect(() => {
    if (data?.[day]?.date?.hijri?.holidays.length > 0) {
      setHoliday(data[day].date.hijri.holidays.join(" - "));
    }
  }, [data, day]);

  // Use useMemo to filter only five prayer times
  const prayerTimes = useMemo(() => {
    const filteredTimes = [
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
    ].reduce((acc, prayer) => {
      acc[prayer] = allTimes[prayer];
      return acc;
    }, {});

    return filteredTimes;
  }, [allTimes]);

  const changePath = (path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =================== nextPrayer and remainingTime ==============================

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const response = await axios.get(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=K8B8RYWN7UNQ&format=json&by=position&lat=${latitude}&lng=${longitude}`
        );
        const formattedTime = response.data.formatted.split(" ")[1].slice(0, 5);
        setCurrentTime(formattedTime);

        const { nextPrayer, remainingTime } = getNextPrayerTime(
          formattedTime,
          prayerTimes
        );
        setNextPrayer(nextPrayer);
        setRemainingTime(remainingTime);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTime();
    const intervalId = setInterval(fetchCurrentTime, 10000);

    return () => clearInterval(intervalId);
  }, [latitude, longitude, prayerTimes]);

  const cleanPrayerTime = (time) => {
    return time.replace(/\s*\(.*?\)\s*/g, "").trim();
  };

  const getNextPrayerTime = (currentTime, prayerTimes) => {
    const currentMinutes = timeToMinutes(currentTime);

    let nextPrayer = null;
    let remainingTime = Infinity;

    for (const [prayerName, prayerTime] of Object.entries(prayerTimes)) {
      const cleanedTime = cleanPrayerTime(prayerTime);
      const prayerMinutes = timeToMinutes(cleanedTime);

      if (prayerMinutes > currentMinutes) {
        const timeDiff = prayerMinutes - currentMinutes;
        if (timeDiff < remainingTime) {
          nextPrayer = prayerName;
          remainingTime = timeDiff;
        }
      }
    }

    if (!nextPrayer) {
      nextPrayer = "Fajr";
      const fajrTime = timeToMinutes(cleanPrayerTime(prayerTimes["Fajr"]));
      remainingTime = 1440 - currentMinutes + fajrTime; // 1440 دقيقة في اليوم
    }

    const hours = Math.floor(remainingTime / 60);
    const minutes = remainingTime % 60;

    return {
      nextPrayer,
      remainingTime: { hours, minutes },
    };
  };

  return (
    <div className="min-h-screen pt-[80px] overflow-hidden mx-[20px]">
      {/* part One */}
      <div className="flex flex-col justify-center">
        <h2 className="mb-[30px] text-center text-[40px] font-[700]">
          {t("prayer-times")}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-screen mx-auto">
            <PuffLoader color="#38bdf8" size={100} speedMultiplier={3} />
          </div>
        ) : (
          <div className="flex justify-around font-[600] text-[18px] mb-[20px]">
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
        )}

        {/* holidays */}
        {holiday && (
          <div className=" mt-[30px] text-center text-red-800 text-[40px] font-[600]">
            Today is {holiday}
          </div>
        )}

        {/* timeRemaining */}
        {currentTime && (
          <h1 className="text-center font-[800]">
            {t("Time-Now")} {convertTimeFormat(currentTime)}
          </h1>
        )}
        {nextPrayer && remainingTime ? (
          <div className="text-center my-[20px] select-none">
            <p className="mb-[10px] text-[20px] font-[600] animate-pulse">
              {t("next-prayer")}
              <span>{t(nextPrayer)}</span>
            </p>

            <h2 className="flex justify-center gap-[15px] text-[18px]">
              {t("remaining-time")}
              <span className="text-red-500 font-[700]">
                {remainingTime.hours === 0
                  ? `${remainingTime.minutes} ${t(
                      remainingTime.minutes > 1 ? "minutes" : "minute"
                    )}`
                  : `${remainingTime.hours} ${t(
                      remainingTime.hours > 1 ? "hours" : "hour"
                    )} ${t("and")} ${remainingTime.minutes} ${t(
                      remainingTime.minutes > 1 ? "minutes" : "minute"
                    )}`}
              </span>
            </h2>
          </div>
        ) : (
          <div className="flex items-center justify-center my-[10px]">
            <MagnifyingGlass
              visible={true}
              height="80"
              width="80"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperClass="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#e15b64"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row justify-around mb-[30px]">
        <div className="flex-1">
          <Select
            className=""
            placeholder={t("Choose-how-to-calculate-prayer-times")}
            onChange={HandelSelectedMethod}
            options={allOptions}
          />
        </div>
        <div className="flex-1">
          <button
            className="bg-green-400 text-[18px] font-[600] rounded-[6px] px-[20px] py-[5px] w-full h-full"
            onClick={() => changePath("/location")}
          >
            {t("Choose-the-location-manually")}
          </button>
        </div>
      </div>

      {/* part two */}
      <div className="flex flex-col md:justify-between md:gap-[20px] md:flex-row">
        {/* img */}
        <div className="flex-1 hidden xl:block">
          <img
            src={childPray}
            className="object-cover h-full w-full rounded-[6px]"
            alt="Child Pray"
          />
        </div>

        {/* prayer times */}
        <div className="flex-1 py-[16px] bg-primary text-secondary rounded-[6px] max-w-[500px] md:max-w-full">
          <div className="flex px-[20px] justify-between font-[700] text-[18px] pb-[16px] border-b-[2px] border-secondary">
            <div className="">{t("name-of-salat")}</div>
            <div className="">{t("azan-time")}</div>
          </div>
          {Object.entries(prayerTimes).map(
            ([prayerName, prayerTime], index) => (
              <div
                key={index}
                className={`flex justify-between font-[700] text-[16px] px-[20px] ${
                  index === Object.keys(prayerTimes).length - 1
                    ? "pt-[12px]"
                    : "py-[12px] border-b border-solid border-secondary"
                }`}
              >
                <div>{t(prayerName)}</div>
                <div>{convertTimeFormat(prayerTime)}</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
