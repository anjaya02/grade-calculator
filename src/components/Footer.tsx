import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { SiteBrand } from "./SiteBrand";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#eeefe8]">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <SiteBrand />
            <p className="mt-3 text-xs text-muted-foreground">
              Made for the work you put in.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-muted-foreground">
              Designed & built by{" "}
              <span className="whitespace-nowrap font-medium text-foreground">
                Anjaya Induwara
              </span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-muted-foreground sm:justify-end">
              <a
                href="mailto:anjaya.20234069@iit.ac.lk"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                Get in touch{" "}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
              <Link
                href="https://github.com/anjaya02"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Anjaya on GitHub"
                className="rounded-sm transition-colors hover:text-primary"
              >
                <Github className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/anjaya02"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Anjaya on LinkedIn"
                className="rounded-sm transition-colors hover:text-primary"
              >
                <Linkedin className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
