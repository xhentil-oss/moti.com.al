export const FooterMap = () => {
  return (
    <div className="relative box-border caret-transparent gap-x-5 flex flex-col flex-wrap min-h-[auto] gap-y-5 w-full mx-[0%] my-[20%] md:flex-nowrap md:w-[18.984%] md:m-0">
      <div className="relative box-border caret-transparent gap-x-5 max-w-full min-h-[auto] gap-y-5 w-full overflow-hidden">
        <div className="box-border caret-transparent leading-[0px]">
          <iframe
            src="https://maps.google.com/maps?q=Albania&t=m&z=2&output=embed&iwloc=near"
            title="Albania"
            aria-label="Albania"
            className="box-border caret-transparent inline brightness-100 contrast-100 saturate-0 blur-0 hue-rotate-0 h-[245px] leading-4 max-w-full align-baseline w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
