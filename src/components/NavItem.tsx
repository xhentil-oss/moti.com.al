export type NavItemProps = {
  href: string;
  label: string;
  iconSrc: string;
  anchorVariantClass: string;
  spanVariantClass: string;
  imgVariantClass: string;
};

export const NavItem = (props: NavItemProps) => {
  return (
    <a
      href={props.href}
      className={`items-center box-border caret-transparent flex min-w-0 py-2 rounded-[14px] md:min-w-[auto] hover:bg-white/10 ${props.anchorVariantClass}`}
    >
      <span
        className={`box-border caret-transparent flex h-5 leading-[0px] w-5 ${props.spanVariantClass}`}
      >
        <img
          src={props.iconSrc}
          alt="Icon"
          className={`box-border caret-transparent align-baseline ${props.imgVariantClass}`}
        />
      </span>
      <span
        className={`font-medium box-border caret-transparent block ${props.spanVariantClass}`}
      >
        {props.label}
      </span>
    </a>
  );
};
