import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import kaaba from "../assets/logo.png";

import {
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const formSubmit = useRef();
  const { t } = useTranslation();

  const sendToEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_h193ald",
        "template_uu4znoa",
        formSubmit.current,
        "_nUc4HRr3zjmA2zUA"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    toast.success("Your Message Successful.", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    e.target.reset();
  };

  const changePath = (path) => {
    navigate(`${path}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-center xl:items-stretch flex-row items-center xl:justify-start gap-[20px] p-[20px]">
          {/* logo */}
          <div className="flex flex-col justify-between">
            {/* muslim */}
            <div className="flex gap-[25px]">
              <a href="/" className="flex flex-col items-center cursor-pointer">
                <img className="w-[30px] h-[30px]" src={kaaba} alt="Muslim" />
                <span className="font-logo text-[18px] font-[800]">
                  {t("Muslim")}
                </span>
              </a>
            </div>
            {/* text */}
            <p className="text-[15px] font-[500] py-[20px] max-w-[400px]">
              {t("Reassure-your-heart")}
            </p>
            <p className="text-[15px] font-[500] max-w-[400px]">
              {t("Contains-everything")}
            </p>
            {/* icone */}
            <div className="flex justify-center gap-[10px] my-[30px]">
              <a
                href="https://www.facebook.com/profile.php?id=100003047715580&mibextid=LQQJ4d"
                target="_blank"
                aria-label="Facebook"
                className="w-[35px] h-[35px] rounded-full bg-primary hover:bg-primary-hover flex justify-center items-center"
              >
                <FaFacebookF size="20px" />
              </a>
              <a
                href="https://wa.me/01026469007"
                target="_blank"
                aria-label="Twitter"
                className="w-[35px] h-[35px] rounded-full bg-primary hover:bg-primary-hover flex justify-center items-center"
              >
                <FaWhatsapp size="20px" />
              </a>
              <a
                href="https://instagram.com/ahmed_allawi0"
                target="_blank"
                aria-label="Instagram"
                className="w-[35px] h-[35px] rounded-full bg-primary hover:bg-primary-hover flex justify-center items-center"
              >
                <FaInstagram size="20px" />
              </a>
              <a
                href="https://www.linkedin.com/in/ahmed-allawi-327a4b252"
                target="_blank"
                aria-label="LinkedIn"
                className="w-[35px] h-[35px] rounded-full bg-primary hover:bg-primary-hover flex justify-center items-center"
              >
                <FaLinkedinIn size="20px" />
              </a>
            </div>
          </div>
          {/* important links */}
          <ul className="hidden xl:flex-col xl:flex xl:items-center xl:flex-1">
            <li className="mx-[15px] mb-[15px] font-[800] text-[20px] border-black border-b border-solid">
              {t("Important-links")}
            </li>
            <li
              className=" w-[150px] text-center mx-[15px] cursor-pointer bg-primary hover:bg-primary-hover rounded-md font-[500] text-[20px] my-[10px]"
              onClick={() => changePath("/")}
            >
              {t("prayer-times")}
            </li>
            <li
              className=" w-[150px] text-center mx-[15px] cursor-pointer bg-primary hover:bg-primary-hover rounded-md font-[500] text-[20px] my-[10px]"
              onClick={() => changePath("/quran")}
            >
              {t("Quran")}
            </li>
            <li
              className=" w-[150px] text-center mx-[15px] cursor-pointer bg-primary hover:bg-primary-hover rounded-md font-[500] text-[20px] my-[10px]"
              onClick={() => changePath("/adhkar")}
            >
              {t("Adhkar")}
            </li>
          </ul>
          {/* form */}
          <form
            ref={formSubmit}
            onSubmit={sendToEmail}
            className="h-full flex flex-col gap-[10px] w-full max-w-[500px]"
          >
            <h2 className="font-[800] mb-[10px] text-[20px] border-black border-b border-solid w-fit">
              {t("Contact-us")}
            </h2>
            <label className="flex flex-col text-[14px] font-[800]">
              {t("Name")} *
              <input
                type="text"
                name="name"
                required
                className="h-[30px] p-[8px] text-[14px] font-[600] bg-[#e6ffec] border border-solid border-secondary rounded-md hover:outline-none"
              />
            </label>

            <label className="flex flex-col text-[14px] font-[800]">
              {t("Email")} *
              <input
                type="email"
                name="email"
                required
                className="h-[30px] p-[8px] text-[14px] font-[600] bg-[#e6ffec] border border-solid border-secondary rounded-md hover:outline-none"
              />
            </label>

            <label className="flex flex-col text-[14px] font-[800]">
              {t("Message")} *
              <textarea
                name="message"
                required
                className="h-[60px] p-[8px] text-[14px] font-[600] bg-[#e6ffec] border border-solid border-secondary rounded-md hover:outline-none"
              />
            </label>

            <div className="button_submit">
              <button
                type="submit"
                value="Send"
                className="w-full py-[5px] text-[14px] font-[700] rounded-[20px] bg-primary hover:bg-primary-hover"
              >
                {t("Submit")}
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>

        <p className="text-center text-secondary font-[600] py-[10px] border-t border-solid border-secondary">
          &copy; 2024 Allawi. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
