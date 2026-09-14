"use client";

import { useEffect, useRef } from "react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

// Bare-bones typography used as a fallback when the pasted HTML carries no
// styles of its own. Anything the article defines in its own <style>/inline
// styles is appended after and therefore overrides these defaults.
const BASE_STYLES = `
h1{font-size:1.5rem;font-weight:700;line-height:1.3;margin:0.75rem 0}
h2{font-size:1.25rem;font-weight:600;line-height:1.35;margin:0.5rem 0}
h3{font-size:1.125rem;font-weight:600;line-height:1.4;margin:0.5rem 0}
p{margin:0.5rem 0;line-height:1.625}
blockquote{border-left:4px solid #e5e7eb;padding-left:1rem;font-style:italic;color:#6b7280;margin:1rem 0}
ul{list-style:disc;padding-left:1.25rem;margin:0.75rem 0}
ol{list-style:decimal;padding-left:1.25rem;margin:0.75rem 0}
li{margin:0.25rem 0}
a{color:#005dff;text-decoration:underline}
strong{font-weight:700}
em{font-style:italic}
img{max-width:100%;height:auto}
hr{border:none;border-top:1px solid #e5e7eb;margin:1.5rem 0}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{border:1px solid #e5e7eb;padding:0.5rem;text-align:left}
pre{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:1rem;overflow:auto}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
`;

type HtmlPreviewProps = {
    html: string;
    className?: string;
};

// Renders raw HTML inside a shadow root so the article's <style> rules and
// fonts are honoured without leaking onto the rest of the admin UI.
export function HtmlPreview({ html, className }: HtmlPreviewProps) {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        if (!host.shadowRoot) host.attachShadow({ mode: "open" });
        host.shadowRoot!.innerHTML = `${`<style>${BASE_STYLES}</style>`}${sanitizeHtml(html)}`;
    }, [html]);

    return <div ref={hostRef} className={className} />;
}