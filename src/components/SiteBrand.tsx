import Link from "next/link";

export function SiteBrand() {
  return (
    <Link
      href="/"
      aria-label="Degree Calculator home"
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-sm outline-offset-4 sm:gap-3"
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary font-display text-[25px] leading-none text-white sm:size-9 sm:text-[27px]"
      >
        d<span className="text-[#c1d8ac]">.</span>
      </span>
      <span className="text-sm font-semibold tracking-[-0.035em] sm:text-[15px]">
        Degree Calculator<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
