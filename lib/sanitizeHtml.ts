// Content sanitizer for blog bodies.
//
// Keeps the pasted HTML's design (inline styles, classes, <style> blocks and
// stylesheet links) intact while removing anything that could execute or leak
// (scripts, iframes, embeds, event handlers, javascript: URLs, non-CSS links).
// The output is idempotent so it is safe to re-apply on every keystroke.

const UNSAFE_TAGS = ['script', 'iframe', 'object', 'embed', 'meta', 'base', 'title'];

export function sanitizeHtml(html: string): string {
    if (!html) return html;

    const doc = new DOMParser().parseFromString(html, 'text/html');

    // A full document pastes its design in <head>; hoist those styles before
    // dropping the head so the design is preserved.
    const styles = Array.from(doc.head.querySelectorAll('style'))
        .map((style) => style.outerHTML)
        .join('\n');

    doc.querySelectorAll(UNSAFE_TAGS.join(',')).forEach((el) => el.remove());
    doc.querySelectorAll('link').forEach((el) => {
        const rel = (el.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
        if (!rel.includes('stylesheet')) el.remove();
    });

    doc.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
            if (attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name);
        });
    });
    doc.querySelectorAll('a[href]').forEach((el) => {
        const href = el.getAttribute('href') ?? '';
        if (href.trim().toLowerCase().startsWith('javascript:')) el.setAttribute('href', '#');
    });
    doc.querySelectorAll('img[src]').forEach((el) => {
        const src = el.getAttribute('src') ?? '';
        if (src.trim().toLowerCase().startsWith('javascript:')) el.removeAttribute('src');
    });

    return styles ? `${styles}\n${doc.body.innerHTML}` : doc.body.innerHTML;
}