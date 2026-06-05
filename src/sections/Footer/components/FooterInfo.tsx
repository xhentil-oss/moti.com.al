import { FooterLogo } from "@/sections/Footer/components/FooterLogo";
import { FooterDescription } from "@/sections/Footer/components/FooterDescription";

export const FooterInfo = () => {
  return (
    <div className="relative box-border caret-transparent gap-x-[30px] flex flex-col flex-wrap min-h-[auto] order-[99999] gap-y-[30px] w-full p-[0%] md:gap-x-8 md:flex-nowrap md:order-none md:gap-y-8 md:w-[44%] md:pr-[23%]">
      <div className="relative box-border caret-transparent gap-x-[30px] max-w-full min-h-[auto] gap-y-[30px] md:gap-x-8 md:gap-y-8">
        <div className="box-border caret-transparent text-center md:text-start">
          <FooterLogo />
          <FooterDescription />
        </div>
      </div>
      <div className="relative text-slate-600 font-light box-border caret-transparent gap-x-[30px] max-w-full min-h-[auto] gap-y-[30px] font-poppins md:gap-x-8 md:gap-y-8">
        <p className="box-border caret-transparent mb-[14.4px]">
          Powered by{" "}
          <a
            href="https://weather.al/"
            className="text-pink-600 box-border caret-transparent hover:text-slate-700 hover:border-slate-700"
          >
            Weather
          </a>
        </p>
      </div>
    </div>
  );
};
