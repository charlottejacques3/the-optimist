import { parse } from "npm:node-html-parser";

export async function callArticleSearch(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await response.text();
  const root = parse(html);

  // Remove noise elements
  root.querySelectorAll("script, style, nav, header, footer, aside").forEach(el => el.remove());

  const text = root.querySelector("article, main, .article-body, .post-content")
    ?.text ?? root.querySelector("body")?.text ?? "";

  return text.replace(/\s+/g, " ").trim().slice(0, 3000);
}