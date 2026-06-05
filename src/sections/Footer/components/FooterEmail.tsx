export const FooterEmail = () => {
  return (
    <div className="relative box-border caret-transparent gap-x-6 max-w-full min-h-[auto] gap-y-6">
      <ul className="box-border caret-transparent list-none pl-0">
        <li className="relative items-center box-border caret-transparent flex">
          <a
            href="mailto://info@moti.com.al"
            className="text-pink-600 text-sm font-light items-center box-border caret-transparent flex leading-[21px] min-h-[auto] min-w-[auto] w-full font-poppins md:text-base md:leading-6 hover:text-slate-700 hover:border-slate-700"
          >
            <span className="text-slate-600 text-sm box-border caret-transparent block leading-[21px] min-h-[auto] min-w-[auto] md:text-base md:leading-6">
              Email: info@moti.com.al
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};
