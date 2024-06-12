import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import BesmAllah from "../assets/besm-allah.png";
import AyahImg from "../assets/auah1.png";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { PuffLoader } from "react-spinners";

const Surah = () => {
  const { surahId } = useParams();

  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const fetchOneSurah = async () => {
    try {
      const { data } = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.asad,en.pickthall`
      );
      const dataAra = data.data[0];
      const dataEng = data.data[1];

      return { dataAra, dataEng };
    } catch (error) {
      throw new Error("Failed to fetch Surah data");
    }
  };

  // useQuery
  const { data, error, isLoading, isError } = useQuery(
    ["surah", surahId],
    fetchOneSurah
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen mx-auto">
        <PuffLoader color="#38bdf8" size={100} speedMultiplier={3} />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const removeBasmalah = (ayahText) => {
    const regex = /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/;
    return ayahText.replace(regex, "");
  };

  return (
    <div className="pt-[100px] m-[12px]">
      <div className="flex flex-col justify-center">
        {/* name surah */}
        <div className="flex justify-around">
          <p className="text-primary">
            {data.dataEng?.ayahs.length} {t("Ayahs")}
          </p>
          <h1 className="text-[30px] mb-[20px] font-[700]">
            {currentLanguage === "en"
              ? data.dataEng?.englishName
              : data.dataAra?.name}
          </h1>
          <p className="text-primary font-[500]">
            {t(data.dataEng?.revelationType)}
          </p>
        </div>

        {/* besmAllah */}
        <div className="flex items-center justify-center select-none">
          {data.dataAra.number === 1 ? (
            <div
              className={`${
                currentLanguage == "en" && "flex-row-reverse"
              } flex justify-center mb-[20px]`}
            >
              <img
                src={BesmAllah}
                className="w-[600px] max-w-full"
                alt={data.dataAra?.name}
              />
              <div className="relative flex items-center">
                <img
                  className="w-[70px] h-[70px]"
                  src={AyahImg}
                  alt="ayah mark"
                />
                <span className="flex justify-center items-center font-[700] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px]">
                  1
                </span>
              </div>
            </div>
          ) : (
            <img
              src={BesmAllah}
              className="w-[600px] max-w-full"
              alt={data.dataAra?.name}
            />
          )}
        </div>
      </div>

      {/* ayahs */}
      <div className="flex flex-wrap justify-center">
        {data.dataAra.ayahs.map(
          (ayah, index) =>
            !(data.dataAra.number === 1 && ayah.numberInSurah === 1) && (
              <div
                key={index}
                className="flex items-center justify-between text-center w-full py-[20px] border-b border-primary"
              >
                {/* text */}
                <div className="flex flex-col items-center justify-center flex-1 font-[400] text-secondary">
                  {index === 0 ? (
                    <p className="textAra text-[25px] leading-[60px]">
                      {removeBasmalah(ayah.text)}
                    </p>
                  ) : (
                    <p className="textAra text-[25px] leading-[60px]">
                      {ayah.text}
                    </p>
                  )}
                  {currentLanguage === "en" && (
                    <p className="textEng text-[25px] font-[500]">
                      {data.dataEng.ayahs[index].text}
                    </p>
                  )}
                </div>

                {/* number */}
                <div className="relative min-w-[60px] mb-[10px] select-none">
                  <img
                    className="w-[60px] h-[60px]"
                    src={AyahImg}
                    alt="ayah mark"
                  />
                  <span className="flex justify-center items-center font-[700] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px]">
                    {ayah.numberInSurah}
                  </span>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Surah;
