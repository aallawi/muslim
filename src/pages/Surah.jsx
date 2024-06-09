import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import BesmAllah from "../assets/besm-allah.png";
import Ayah from "../assets/ayah.png";

const Surah = () => {
  const { surahId } = useParams();

  const fetchOneSurah = async () => {
    const { data } = await axios.get(
      `https://api.alquran.cloud/v1/surah/${surahId}`
    );
    return data;
    // return data?.data.ayahs;
  };

  const { data, error, isLoading, isError } = useQuery("surahs", fetchOneSurah);
  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="pt-[100px]">
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-[30px]">{data?.data.name}</h1>
        <img src={BesmAllah} className="max-w-[600px]" alt={data?.data.name} />
      </div>
      <ul className="flex flex-row flex-wrap">
        {data?.data.ayahs.map((ayah, index) => (
          <li key={index} className="flex items-center justify-center">
            <div className="text-[30px] mx-[10px]">{ayah.text}</div>
            <div className="relative w-[70px] h-[70px]">
              <img className="w-[70px] h-[70px]" src={Ayah} alt="ayah mark" />
              <span className=" flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px]">
                {ayah.numberInSurah}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Surah;
