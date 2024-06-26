import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Select from "react-select";
import { PuffLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import allMethod from "../assets/data/allMethod";

const Manually = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

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

  const {
    data: countries,
    error: countriesError,
    isLoading: countriesLoading,
  } = useQuery("countries", fetchCountries);

  const countryOptions = countries?.map((country) => ({
    value: country.isoCode,
    label: country.name,
    country,
  }));

  const HandelSelectedCountry = (country) => {
    setCountryCode(country.isoCode);
    setSelectedCountry(country);
  };

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
    localStorage.setItem(
      "selectedCity",
      `${selectedCountry.name} - ${city.name}`
    );
    localStorage.setItem("latitude", city.latitude);
    localStorage.setItem("longitude", city.longitude);
  };

  const allOptions = useMemo(() => {
    return allMethod.map((method) => ({
      value: method.value,
      label: currentLanguage === "en" ? method.labelEn : method.labelAr,
    }));
  }, [currentLanguage]);

  const HandelSelectedMethod = (selectedOption) => {
    setSelectedMethod(selectedOption);
    localStorage.setItem("method", selectedOption.value);
  };

  if (countriesLoading || citiesLoading)
    return (
      <div className="flex items-center justify-center h-screen mx-auto">
        <PuffLoader color="#38bdf8" size={100} speedMultiplier={3} />
      </div>
    );
  if (countriesError)
    return (
      <div>حدث خطأ ما أثناء جلب قائمة البلدان: {countriesError.message}</div>
    );
  if (citiesError)
    return <div>حدث خطأ ما أثناء جلب قائمة المدن: {citiesError.message}</div>;

  const searchHandler = (event) => {
    if ((event.type === "click" || event.key === "Enter") && selectedCity) {
      navigate("/");
    }
  };

  return (
    <div className="pt-[100px]">
      <div className="max-w-[700px] min-h-[500px] md:mx-auto mx-3 mb-[30px]">
        <div className="h-[400px]">
          <div className="country mb-[20px]">
            <Select
              value={
                selectedCountry
                  ? {
                      value: selectedCountry.isoCode,
                      label: selectedCountry.name,
                    }
                  : null
              }
              placeholder={t("Choose-your-country")}
              onChange={(selectedOption) =>
                HandelSelectedCountry(selectedOption.country)
              }
              options={countryOptions}
            />
          </div>

          {selectedCountry && (
            <div className="city mb-[20px]">
              <Select
                value={
                  selectedCity
                    ? {
                        value: selectedCity,
                        label: selectedCity,
                      }
                    : null
                }
                placeholder={t("Choose-your-city")}
                onChange={HandelSelectedCity}
                options={cityOptions}
                onKeyUp={searchHandler}
              />
            </div>
          )}
          {selectedCity && (
            <>
              <div className="calculate mb-[20px]">
                <Select
                  className="mb-[40px]"
                  value={selectedMethod}
                  placeholder={t("Choose-how-to-calculate-prayer-times")}
                  onChange={HandelSelectedMethod}
                  options={allOptions}
                />
              </div>
              <button
                onClick={searchHandler}
                className=" bg-primary hover:bg-primary-hover px-[30px] py-[5px] rounded-[6px] text-center"
              >
                {t("Submit")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manually;
