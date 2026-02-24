import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code, Root as MdastRoot } from "mdast"
import { BuildCtx } from "../../util/ctx"

interface Options {
  showConsole: boolean
}

const defaultOpts: Options = { showConsole: false }

/**
 * TikZJax transformer plugin for Quartz v4.
 *
 * Converts ```tikz code blocks to inline SVGs at **build time** using
 * the node-tikzjax package. The resulting HTML pages contain static SVG
 * elements — no client-side JavaScript or WebAssembly download needed.
 *
 * In watch mode (`quartz build --serve`) TikZ blocks are skipped to keep
 * rebuilds fast; SVGs from the last full build remain visible.
 *
 * Markdown usage (same format as the Obsidian TikZJax plugin):
 *
 * ```tikz
 * \usetikzlibrary{arrows.meta}
 * \begin{document}
 * \begin{tikzpicture}
 *   ...
 * \end{tikzpicture}
 * \end{document}
 * ```
 */
export const TikZJax: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const o = { ...defaultOpts, ...opts }

  return {
    name: "TikZJax",

    markdownPlugins(ctx: BuildCtx) {
      // Skip in watch/serve mode so incremental rebuilds stay fast.
      if (ctx.argv.watch) return []

      return [
        () =>
          async (tree: MdastRoot) => {
            // Dynamic import so the WASM binary is only loaded when a page actually
            // contains a tikz block. The `@ts-ignore` suppresses the missing-types
            // warning until node-tikzjax ships its own declaration files.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { load, tex, dvi2svg } = await import("node-tikzjax")

            // Collect all tikz code nodes *before* modifying the tree (splicing
            // during traversal can cause visit to skip or double-visit nodes).
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type TikzEntry = { index: number; parent: any; value: string }
            const tikzNodes: TikzEntry[] = []

            // `index` and `parent` need explicit types because TypeScript cannot
            // always infer them from unist-util-visit's generic overloads under
            // strict mode + "node" moduleResolution.  `parent` is `any` (explicit,
            // not implicit) because a Code node's parent can be Root, Blockquote,
            // ListItem, etc. — all share a `children` array we splice into.
            visit(
              tree,
              "code",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (node: Code, index: number | null, parent: any) => {
                if (node.lang === "tikz" && index !== null && parent !== null) {
                  tikzNodes.push({ index, parent, value: node.value })
                }
              },
            )

            if (tikzNodes.length === 0) return

            // Load the TeX WebAssembly runtime once per page (load() is idempotent).
            await load()

            // Process in reverse order so that earlier splices don't shift later indices.
            for (const { index, parent, value } of tikzNodes.reverse()) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const dvi = await tex(value, { showConsole: o.showConsole })
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const svg: string = await dvi2svg(dvi)

                // Replace the fenced code block with the rendered SVG in a
                // container div so CSS can control layout and dark-mode colours.
                parent.children.splice(index, 1, {
                  type: "html",
                  value: `<div class="tikzjax-container">${svg}</div>`,
                })
              } catch (e) {
                console.error(`[TikZJax] Failed to render diagram:\n${e}`)
                // On error the original code block stays in place so the raw
                // source is visible instead of an empty gap.
              }
            }
          },
      ]
    },

    externalResources() {
      return {
        // Only the font stylesheet is required — SVGs are already embedded in HTML.
        css: [
          {
            content: "https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
