import { Fragment, type ComponentProps } from "react";
import { MarkdownAsync } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { bundledLanguages, codeToTokens, type BundledLanguage } from "shiki";
import { CodeBlock } from "./code-block";

async function Code({ children, className }: ComponentProps<"code">) {
  const language = /language-(\S+)/.exec(className ?? "")?.[1];
  if (!language) return <code>{children}</code>;

  const { tokens } = await codeToTokens(String(children).replace(/\n$/, ""), {
    lang: language in bundledLanguages ? (language as BundledLanguage) : "text",
    theme: "github-light",
  });

  return (
    <code className={className}>
      {tokens.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {line.map((token, tokenIndex) => (
            <span key={tokenIndex} style={{ color: token.color }}>
              {token.content}
            </span>
          ))}
          {lineIndex < tokens.length - 1 ? "\n" : null}
        </Fragment>
      ))}
    </code>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <MarkdownAsync
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        code: Code,
        pre({ children, node }) {
          const code = node?.children[0];
          if (code?.type !== "element") return <pre>{children}</pre>;

          const text = code.children
            .map((child) => (child.type === "text" ? child.value : ""))
            .join("");
          const language = code.properties.className
            ?.toString()
            .match(/language-(\S+)/)?.[1];

          return (
            <CodeBlock code={text} language={language ?? "text"}>
              {children}
            </CodeBlock>
          );
        },
        table({ children }) {
          return (
            <div
              className="markdown-table"
              tabIndex={0}
              role="region"
              aria-label="Table"
            >
              <table>{children}</table>
            </div>
          );
        },
      }}
    >
      {children}
    </MarkdownAsync>
  );
}
