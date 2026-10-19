import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteBrand } from "@/components/SiteBrand";
import Footer from "@/components/Footer";
import { UsageBanner } from "@/components/UsageBanner";

const courses = [
  {
    id: "cs",
    name: "Computer Science",
    icon: BookOpen,
    description:
      "Your core modules and two optionals at each level, brought together in one weighted result.",
    optionals: "2 optionals per level",
    link: "/cs-calculator",
  },
  {
    id: "se",
    name: "Software Engineering",
    icon: Code2,
    description:
      "A calculation tailored to the SE pathway, with your core modules and one optional at each level.",
    optionals: "1 optional per level",
    link: "/se-calculator",
  },
] as const;

const bands = [
  { label: "First Class", range: "70%+", detail: "First class honours" },
  {
    label: "Second Upper",
    range: "60–69%",
    detail: "Upper second class honours",
  },
  {
    label: "Second Lower",
    range: "50–59%",
    detail: "Lower second class honours",
  },
  { label: "Third Class", range: "40–49%", detail: "Third class honours" },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <SiteBrand />
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              How it works
            </a>
            <a
              href="#calculators"
              className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-primary outline-offset-4"
            >
              Get started <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <section
          className="page-enter grid items-center gap-12 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_290px] lg:gap-20 lg:pt-24"
          aria-labelledby="hero-heading"
        >
          <div>
            <p className="mb-6 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              Built for IIT students
            </p>
            <h1
              id="hero-heading"
              className="max-w-3xl font-display text-[3.25rem] font-normal leading-[1.06] tracking-[-0.045em] sm:text-[4.75rem]"
            >
              A clearer view of
              <br className="hidden sm:block" /> your{" "}
              <span className="italic text-primary">degree.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground sm:text-base">
              Turn your Level 5 and 6 marks into an estimated degree
              classification. A little more clarity for the work you&apos;ve put
              in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                asChild
                className="h-12 rounded-lg px-6 text-sm shadow-none"
              >
                <a href="#calculators">
                  Choose your course{" "}
                  <ArrowDown className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck
                  className="size-4 text-primary"
                  aria-hidden="true"
                />{" "}
                Your marks stay on your device
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute -inset-2 translate-x-2 translate-y-2 rounded-xl border border-border bg-[#eeefe6]"
            />
            <div className="relative rounded-xl border border-border bg-[#fffefa] p-6">
              <div className="mb-9 flex items-center justify-between border-b border-border pb-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  The weighting
                </p>
                <span
                  aria-hidden="true"
                  className="font-mono text-[10px] text-muted-foreground"
                >
                  L5 / L6
                </span>
              </div>
              <div
                className="flex items-end gap-2"
                aria-label="Level 5 contributes one third; Level 6 contributes two thirds"
              >
                <div className="flex h-20 flex-1 items-end rounded-t-sm bg-[#dbe5d4] p-3 font-display text-3xl text-primary">
                  ⅓
                </div>
                <div className="flex h-36 flex-[2] items-end rounded-t-sm bg-primary p-3 font-display text-4xl text-white">
                  ⅔
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-[11px] text-muted-foreground">
                <span className="flex-1">Level 5</span>
                <span className="flex-[2]">Level 6</span>
              </div>
              <div className="mt-7 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Best credits considered
                </span>
                <span className="font-display text-2xl">220</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="calculators"
          aria-labelledby="course-heading"
          className="scroll-mt-8"
        >
          <div className="mb-6 flex items-baseline justify-between gap-4 border-t border-border pt-7">
            <h2
              id="course-heading"
              className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
            >
              Choose your pathway
            </h2>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Computer Science & Software Engineering
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {courses.map(
              ({ id, name, icon: Icon, description, optionals, link }) => (
                <article
                  key={id}
                  className="group flex flex-col rounded-xl border border-border bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-[#a3b79b] hover:shadow-[0_4px_24px_-12px_#25352d26] sm:p-8"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                      <Icon
                        className="size-5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {id}
                    </span>
                  </div>
                  <h3 className="font-display text-[2rem] leading-tight tracking-[-0.025em]">
                    {name}
                  </h3>
                  <p className="mb-6 mt-3 max-w-sm flex-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                  <div className="mb-7 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-muted-foreground">
                    <span>Levels 5 & 6</span>
                    <span aria-hidden="true">/</span>
                    <span>{optionals}</span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full justify-between rounded-lg border-border bg-white px-4 text-primary shadow-none transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                  >
                    <Link href={link}>
                      Calculate {id.toUpperCase()} Degree{" "}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </article>
              ),
            )}
          </div>
        </section>

        <UsageBanner />

        <section
          id="how-it-works"
          className="grid gap-10 border-t border-border py-14 sm:py-20 lg:grid-cols-[1fr_1.25fr] lg:gap-20"
          aria-labelledby="method-heading"
        >
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              The details, made simple
            </p>
            <h2
              id="method-heading"
              className="font-display text-4xl leading-tight tracking-[-0.025em]"
            >
              Every mark has
              <br /> its place.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Your best 220 credits determine the weighted indicator. Level 6
              carries twice the weight of Level 5, and the final indicator is
              rounded before classification.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-6 text-muted-foreground">
              All Level 5 and 6 modules must meet the pass requirements. The
              calculators include a full breakdown of how your result is worked
              out.
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4 pb-4">
              <h3 className="text-sm font-medium">
                Honours classification guide
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Rounded indicator
              </span>
            </div>
            <dl>
              {bands.map(({ label, range, detail }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-t border-border py-4"
                >
                  <dt>
                    <span className="text-sm font-medium">{label}</span>
                    <span className="mt-1 hidden text-xs text-muted-foreground sm:block">
                      {detail}
                    </span>
                  </dt>
                  <dd className="font-display text-[1.75rem] leading-none tracking-tight text-primary">
                    {range}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-border pt-4 text-xs leading-6 text-muted-foreground">
              An indicator below 40%, or a module mark below the pass mark, does
              not receive an Honours classification.
            </p>
          </div>
        </section>

        <aside className="mb-14 flex flex-col items-start gap-1 rounded-lg border border-border bg-[#eeefe7] px-5 py-4 text-xs leading-6 text-muted-foreground sm:flex-row sm:gap-3">
          <span className="shrink-0 font-medium text-foreground">
            A small note.
          </span>
          <p className="flex-1">
            This is an independent student tool, not an official IIT service.
            Results are estimates for guidance; your academic advisor can
            confirm your final award.
          </p>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
