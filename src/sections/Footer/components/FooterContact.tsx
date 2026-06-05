import { FooterSocial } from "@/sections/Footer/components/FooterSocial";
import { FooterEmail } from "@/sections/Footer/components/FooterEmail";

export const FooterContact = () => {
  return (
    <div className="relative box-border caret-transparent gap-x-6 flex flex-col flex-wrap min-h-[auto] gap-y-6 w-6/12 pl-[4%] pr-[0%] py-[0%] md:flex-nowrap md:w-[18.482%] md:p-0">
      <div className="relative box-border caret-transparent gap-x-6 max-w-full min-h-[auto] gap-y-6">
        <h6 className="text-indigo-950 text-lg font-semibold box-border caret-transparent leading-[21.6px] capitalize font-poppins md:text-[22px] md:leading-[26.4px]">
          Get In Touch
        </h6>
      </div>
      <FooterSocial />
      <FooterEmail />
    </div>
  );
};
