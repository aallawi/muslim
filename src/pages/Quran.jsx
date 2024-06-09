import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import i18next from "i18next";

const Quran = () => {
  const navigate = useNavigate();
  const currentLanguage = i18next.language;

  const fetchSurahs = async () => {
    const { data } = await axios.get(
      "https://api.alquran.cloud/v1/quran/en.asad"
    );
    return data?.data.surahs;
  };

  const { data, error, isLoading, isError } = useQuery("surahs", fetchSurahs);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="pt-[100px]">
      <h1 className="text-center text-[18px] mb-[30px]">
        أقرأ بأسم ربك الذي خلق
      </h1>
      <ul className="grid justify-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((surah) => (
          <li
            key={surah.number}
            onClick={() => navigate(`/quran/${surah.number}`)}
            className="group hover:border-primary border-solid border-[1px] font-[600] p-[15px] m-[15px] flex items-center justify-between rounded-[6px] cursor-pointer"
          >
            <div
              className={`${
                currentLanguage == "en" ? "mr-[30px]" : "ml-[30px]"
              }`}
            >
              <p className="flex items-center justify-center  w-[50px] h-[50px] rounded-[6px] group-hover:bg-primary group-hover:text-white rotate-45">
                <span className="-rotate-45 pb-[5px]">{surah.number}</span>
              </p>
            </div>
            <div
              className={`${currentLanguage == "ar" ? "order-9" : "flex-1"}`}
            >
              <h2 className="text-[22px] font-[800] group-hover:text-primary">
                {surah.englishName}
              </h2>
              <h2 className=" text-stone-600 text-[16px] xl:text-[18px]">
                {surah.englishNameTranslation}
              </h2>
            </div>
            <div className={`${currentLanguage == "ar" && "flex-1"}`}>
              <p>{surah.name}</p>
              <p className="text-[18px]">{surah.ayahs.length} Ayahs</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quran;
