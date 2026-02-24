import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code } from "mdast"
import { Element, Root as HastRoot, Text } from "hast"

/**
 * TikZJax transformer plugin for Quartz v4.
 *
 * Converts ```tikz code blocks to <script type="text/tikz"> elements,
 * which are rendered client-side by the tikzjax.com CDN library.
 *
 * The tikzjax library uses a MutationObserver to detect and render
 * new <script type="text/tikz"> elements, so SPA navigation works
 * automatically as long as tikzjax.js is preserved across navigations
 * (via spaPreserve: true).
 */
export const TikZJax: QuartzTransformerPlugin = () => {
  return {
    name: "TikZJax",

    markdownPlugins() {
      return [
        () => (tree: any) => {
          visit(tree, "code", (node: Code) => {
            if (node.lang === "tikz") {
              // Use class "tikz" (not "language-tikz") so that the
              // SyntaxHighlighting plugin (shiki) does not process this block.
              node.data = {
                ...node.data,
                hProperties: {
                  ...((node.data as any)?.hProperties ?? {}),
                  className: ["tikz"],
                },
              }
            }
          })
        },
      ]
    },

    htmlPlugins() {
      return [
        () => (tree: HastRoot) => {
          visit(tree, "element", (node: Element, index, parent) => {
            if (
              node.tagName === "pre" &&
              node.children.length > 0 &&
              node.children[0].type === "element" &&
              (node.children[0] as Element).tagName === "code"
            ) {
              const codeEl = node.children[0] as Element
              const classes = (codeEl.properties?.className as string[]) ?? []

              if (classes.includes("tikz")) {
                // Extract the raw TikZ source text
                const tikzSource = codeEl.children
                  .filter((c): c is Text => c.type === "text")
                  .map((c) => c.value)
                  .join("")

                // Tidy the source: trim lines and remove empty ones
                // (mirrors what the Obsidian tikzjax plugin does)
                const tidied = tikzSource
                  .replaceAll("&nbsp;", "")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0)
                  .join("\n")

                if (parent && index !== undefined && index !== null) {
                  // Replace <pre><code class="tikz"> with a container div
                  // containing the <script type="text/tikz"> that tikzjax processes.
                  parent.children[index] = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["tikzjax-container"] },
                    children: [
                      {
                        type: "element",
                        tagName: "script",
                        properties: { type: "text/tikz" },
                        children: [{ type: "text", value: tidied }],
                      },
                    ],
                  } as Element
                }
              }
            }
          })
        },
      ]
    },

    externalResources() {
      return {
        css: [
          {
            // TikZJax font styles (required for correct rendering)
            content: "https://tikzjax.com/v1/fonts.css",
            spaPreserve: true,
          },
        ],
        js: [
          {
            // TikZJax rendering engine.
            // spaPreserve keeps the script in the <head> across SPA navigations,
            // so the internal MutationObserver stays active and automatically
            // renders new <script type="text/tikz"> elements added to the DOM.
            src: "https://tikzjax.com/v1/tikzjax.js",
            loadTime: "afterDOMReady",
            contentType: "external",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
