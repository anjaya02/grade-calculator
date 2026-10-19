import Link from "next/link";
import { ArrowDownRight, ArrowLeft } from "lucide-react";
import { SiteBrand } from "@/components/SiteBrand";

export function CalculatorHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8">
        <SiteBrand />
        <nav
          aria-label="Calculator navigation"
          className="flex shrink-0 items-center gap-3 sm:gap-6"
        >
          <Link
            href="/"
            className="hidden min-h-10 min-w-10 items-center justify-center gap-2 rounded-md text-xs text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">All courses</span>
          </Link>
          <a
            href="#classification-results"
            className="inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-sm text-xs font-medium text-primary outline-offset-4"
          >
            Your result <ArrowDownRight className="size-4" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
