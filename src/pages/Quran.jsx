import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

const Quran = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      <div className="max-w-[700px] md:mx-auto mx-3 mb-[30px]">
        <p>{t("The-prophet-said")}</p>
        <div
          className={`${
            currentLanguage === "en" && "flex-row-reverse"
          } flex items-center justify-center my-[15px]`}
        >
          <FaQuoteRight
            size={20}
            color="#004445"
            className={`${currentLanguage == "en" ? "self-end" : "self-start"}`}
          />
          <p className="text-primary text-[25px] font-[600] mx-[10px] text-center">
            {t("Read-the-Quran")}
          </p>

          <FaQuoteLeft
            size={20}
            color="#004445"
            className={`${currentLanguage == "en" ? "self-start" : "self-end"}`}
          />
        </div>
        <p className="text-end">{t("The-narrated")}</p>
      </div>
      <ul className="grid justify-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((surah) => (
          <li
            key={surah.number}
            onClick={() => navigate(`/quran/${surah.number}`)}
            className="group hover:border-primary border-solid border-secondary text-secondary border-[1px] font-[600] p-[10px] m-[10px] flex items-center justify-between gap-[20px] rounded-[6px] cursor-pointer"
          >
            {/* number */}

            <p className="flex items-center justify-center  w-[50px] h-[50px] rounded-[6px] group-hover:bg-primary group-hover:text-white rotate-45">
              <span className="-rotate-45">{surah.number}</span>
            </p>

            {/* text */}
            <div className="flex items-center justify-between flex-1">
              {currentLanguage == "en" ? (
                <div>
                  <h2 className="text-[22px] font-[800] group-hover:text-primary">
                    {surah.englishName}
                  </h2>
                  <h2 className=" text-stone-600 text-[16px] xl:text-[18px]">
                    {surah.englishNameTranslation}
                  </h2>
                </div>
              ) : (
                <div>
                  <h2 className="text-[22px] font-[800] group-hover:text-primary">
                    {surah.name}
                  </h2>
                </div>
              )}
              <div className="text-[18px] group-hover:text-primary">
                <p>{t(surah.revelationType)}</p>
                <p>
                  {surah.ayahs.length} {t("Ayahs")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quran;
