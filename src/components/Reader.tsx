import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkGemoji from "remark-gemoji"
import rehypeRaw from "rehype-raw"
import Link from "next/link"

interface ReaderProps {
  content: string;
  fileName: string;
  owner: string;
  repo: string;
}

export function Reader({ content, fileName, owner, repo }: ReaderProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 py-12 md:p-24 selection:bg-accent/10 selection:text-accent">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 md:mb-16 border-b border-sidebar-border/50 pb-8 md:pb-10">
          <div className="mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent/60">
            Lendo
          </div>
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2] md:leading-[1.1]">
            {fileName}
          </h1>
        </header>
        <article className="prose prose-sm md:prose-base max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkGemoji]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ href, children, ...props }) => {
                const isRelative =
                  href &&
                  !href.startsWith("http") &&
                  !href.startsWith("mailto") &&
                  !href.startsWith("#")
                if (isRelative) {
                  return (
                    <Link
                      href={`/reader/${owner}/${repo}?file=${href}`}
                      {...props}
                    >
                      {children}
                    </Link>
                  )
                }
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
