import axios from "axios";
import i18next from "i18next";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { PuffLoader } from "react-spinners";

const Radio = () => {
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  console.log(currentLanguage);

  const fetchRadios = async () => {
    try {
      const response = await axios.get(
        `https://mp3quran.net/api/v3/radios?language=${
          currentLanguage == "en" ? "eng" : "ar"
        }`
      );
      return response.data.radios;
    } catch (error) {
      console.error("Error fetching radios:", error);
      return null;
    }
  };
  const { data, error, isLoading, isError } = useQuery("radios", fetchRadios);

  console.log(data);

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

  return (
    <div className="pt-[100px]">
      <h1 className="mb-[30px] text-center text-[40px] font-[700]">
        {t("Radio-QK")}
      </h1>
      <div className="grid justify-center grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((radio, index) => (
          <Link
            key={radio.id}
            to={radio.url}
            target="_blank"
            className="group hover:border-primary border-solid border-secondary text-secondary border-[1px] font-[600] p-[10px] m-[10px] flex items-center justify-between gap-[20px] rounded-[6px] cursor-pointer"
          >
            {/* number */}
            <p className="flex items-center justify-center  w-[50px] h-[50px] rounded-[6px] group-hover:bg-primary group-hover:text-white rotate-45">
              <span className="-rotate-45">{index + 1}</span>
            </p>

            {/* text */}
            <div className="flex items-center justify-between flex-1">
              <h2 className="text-[22px] font-[800] group-hover:text-primary">
                {radio.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Radio;
