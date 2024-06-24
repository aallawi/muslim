import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Select from "react-select";

// import { FaSearchLocation } from "react-icons/fa";

const Manually = () => {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  const [selectedCity, setSelectedCity] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // ==================================================== Countries ==============================================

  // Fetch All Countries
  const fetchCountries = async () => {
    const response = await axios.get(
      "https://country-state-city-search-rest-api.p.rapidapi.com/allcountries",
      {
        headers: {
          "x-rapidapi-host":
            "country-state-city-search-rest-api.p.rapidapi.com",
          "x-rapidapi-key":
            "6653714b44msh814627977dba186p1c791fjsna35a052baf31",
        },
      }
    );
    return response.data;
  };

  // Use useQuery To Get All Country
  const {
    data: countries,
    error: countriesError,
    isLoading: countriesLoading,
  } = useQuery("countries", fetchCountries);

  // تعديل الخيارات لتتوافق مع react-select
  const countryOptions = countries?.map((country) => ({
    value: country.isoCode,
    label: country.name,
    country,
  }));

  const HandelSelectedCountry = (country) => {
    setCountryCode(country.isoCode);
    setSelectedCountry(country);
  };

  // ==================================================== Cities ==============================================

  const fetchCities = async (countryCode) => {
    const response = await axios.get(
      `https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode=${countryCode}`,
      {
        headers: {
          "x-rapidapi-host":
            "country-state-city-search-rest-api.p.rapidapi.com",
          "x-rapidapi-key":
            "6653714b44msh814627977dba186p1c791fjsna35a052baf31",
        },
      }
    );
    return response.data;
  };

  // Use useQuery To Get All Cities
  const {
    data: cities,
    error: citiesError,
    isLoading: citiesLoading,
    refetch: refetchCities,
  } = useQuery(["cities", countryCode], () => fetchCities(countryCode), {
    enabled: !!countryCode,
  });

  const cityOptions = cities?.map((city) => ({
    value: city.name,
    label: city.name,
    cityData: city,
  }));

  const HandelSelectedCity = (selectedOption) => {
    const city = selectedOption.cityData;
    setSelectedCity(city.name);
    setLongitude(city.longitude);
    setLatitude(city.latitude);
    localStorage.setItem("selectedCity", city.name);
    localStorage.setItem("latitude", city.latitude);
    localStorage.setItem("longitude", city.longitude);
  };

  // إذا حدث خطأ في استرجاع البيانات
  if (countriesLoading || citiesLoading) return <div>جاري التحميل...</div>;
  if (countriesError)
    return (
      <div>حدث خطأ ما أثناء جلب قائمة البلدان: {countriesError.message}</div>
    );
  if (citiesError)
    return <div>حدث خطأ ما أثناء جلب قائمة المدن: {citiesError.message}</div>;

  const searchHandler = (event) => {
    if ((event.type == "click" || event.key == "Enter") && selectedCity) {
      navigate("/");
    }
  };

  return (
    <div className="pt-[100px]">
      <div className="max-w-[700px] md:mx-auto mx-3 mb-[30px]">
        <div className="h-[400px]">
          <div className="country">
            <Select
              value={
                selectedCountry
                  ? {
                      value: selectedCountry.isoCode,
                      label: selectedCountry.name,
                    }
                  : null
              }
              placeholder="اختر البلد الخاصة بك"
              onChange={(selectedOption) =>
                HandelSelectedCountry(selectedOption.country)
              }
              options={countryOptions}
            />
          </div>

          {selectedCountry && (
            <div className="city">
              <Select
                placeholder="اختر المدينة الخاصة بك"
                onChange={HandelSelectedCity}
                options={cityOptions}
                onKeyUp={searchHandler}
              />
            </div>
          )}
          {selectedCity && <button onClick={searchHandler}>Submit</button>}
        </div>
      </div>
    </div>
  );
};

export default Manually;

// =========================================================================================================

{
  /* <h1 className="text-[30px]">مدن البلد: {selectedCountry.name}</h1>
<button onClick={() => setSelectedCountry(null)}>
  اختر بلدك
</button>
<h1 className="bg-lime-400 p-[10px]">All Cities</h1>
<ul>
  {cities.map((city, index) => (
    <li
      key={index}
      className="cursor-pointer"
      onClick={() => HandelSelectedCity(city)}
    >
      {index + 1}-{city.name}
    </li>
  ))}
</ul> */
}

// const [latitude, setLatitude] = useState(null);
// const [longitude, setLongitude] = useState(null);

// استرجاع قائمة المدن لبلد محدد
// const fetchCities = async (countryCode) => {
//   const response = await axios.get(
//     `https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode=${countryCode}`,
//     {
//       headers: {
//         "x-rapidapi-host":
//           "country-state-city-search-rest-api.p.rapidapi.com",
//         "x-rapidapi-key":
//           "6653714b44msh814627977dba186p1c791fjsna35a052baf31",
//       },
//     }
//   );
//   return response.data;
// };

// const HandelSelectedCity = (city) => {
//   setLatitude(city.latitude);
//   setLongitude(city.longitude);
//   changePath("/");
// };

// const {
//   data: cities,
//   error: citiesError,
//   isLoading: citiesLoading,
//   refetch: refetchCities,
// } = useQuery(["cities", countryCode], () => fetchCities(countryCode), {
//   enabled: !!countryCode,
// });

// const changePath = (path) => {
//   navigate(`${path}`);
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth",
//   });
// };
