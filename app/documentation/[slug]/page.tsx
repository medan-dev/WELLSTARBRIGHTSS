import Link from "next/link";
import { notFound } from "next/navigation";
import { DOC_ARTICLES, DocArticle } from "@/lib/docs-data";
import { DocsTOC } from "@/components/docs/DocsTOC";
import { DocsCallout } from "@/components/docs/DocsCallout";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";
import { DocsFeedback } from "@/components/docs/DocsFeedback";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(DOC_ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = DOC_ARTICLES[slug];

  if (!article) {
    return { title: "Documentation | EDUREXA" };
  }

  return {
    title: `${article.title} | EDUREXA Docs`,
    description: article.description,
  };
}

export default async function DocArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = DOC_ARTICLES[slug];

  if (!article) {
    notFound();
  }

  // Calculate Previous and Next articles for bottom pagination
  const slugs = Object.keys(DOC_ARTICLES);
  const currentIndex = slugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;

  const prevArticle = prevSlug ? DOC_ARTICLES[prevSlug] : null;
  const nextArticle = nextSlug ? DOC_ARTICLES[nextSlug] : null;

  return (
    <div className="flex-1 flex flex-col xl:flex-row">
      {/* Central Documentation Article */}
      <article className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#0b2256] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/documentation" className="hover:text-[#0b2256] transition-colors">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-slate-500">{article.category}</span>
          <span>/</span>
          <span className="text-[#f26522] font-semibold">{article.shortTitle || article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-none text-xs font-mono font-bold bg-[#0b2256] text-white">
              {article.category}
            </span>
            {article.badge && (
              <span className="px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {article.badge.text}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5 text-slate-400" />
              <span>{article.readingTime}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">Updated {article.lastUpdated}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {article.content.lead}
          </p>
        </header>

        {/* Article Body Sections */}
        <div className="space-y-12 pt-8">
          {article.content.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">
                {section.title}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {section.body.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Callout Alert if present */}
              {section.callout && (
                <DocsCallout
                  type={section.callout.type}
                  title={section.callout.title}
                  message={section.callout.message}
                />
              )}

              {/* Step Sequence if present */}
              {section.steps && section.steps.length > 0 && (
                <div className="space-y-3 my-6">
                  {section.steps.map((st, stIdx) => (
                    <div
                      key={stIdx}
                      className="p-4 rounded-none border border-slate-300 bg-white hover:border-[#0b2256] transition-colors flex gap-3.5"
                    >
                      <div className="size-8 rounded-none bg-[#0b2256] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {st.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900">{st.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table if present */}
              {section.table && (
                <div className="my-6 overflow-x-auto rounded-none border border-slate-300">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-300 text-slate-700 font-bold font-mono">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-slate-600">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`p-3 ${cIdx === 0 ? "font-semibold text-slate-900 font-mono" : ""}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Code / Configuration Snippet if present */}
              {section.codeExample && (
                <DocsCodeBlock
                  title={section.codeExample.title}
                  language={section.codeExample.language}
                  code={section.codeExample.code}
                />
              )}
            </section>
          ))}
        </div>

        {/* Bottom Prev / Next Navigation Cards */}
        <div className="mt-14 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          {prevArticle ? (
            <Link
              href={`/documentation/${prevArticle.slug}`}
              className="flex-1 min-w-[200px] p-3.5 rounded-none border border-slate-300 hover:border-[#0b2256] hover:bg-slate-50 transition-colors group flex items-center gap-3"
            >
              <ArrowLeft className="size-4 text-slate-400 group-hover:text-[#0b2256] group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Previous</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#0b2256] transition-colors">
                  {prevArticle.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle && (
            <Link
              href={`/documentation/${nextArticle.slug}`}
              className="flex-1 min-w-[200px] p-3.5 rounded-none border border-slate-300 hover:border-[#f26522] hover:bg-slate-50 transition-colors group flex items-center justify-end text-right gap-3"
            >
              <div>
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Next</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#f26522] transition-colors">
                  {nextArticle.title}
                </div>
              </div>
              <ArrowRight className="size-4 text-slate-400 group-hover:text-[#f26522] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Feedback Section */}
        <DocsFeedback />
      </article>

      {/* Right Column: Sticky Table of Contents */}
      <div className="hidden xl:block w-64 shrink-0 px-6 py-8 border-l border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <DocsTOC items={article.toc} />
      </div>
    </div>
  );
}
