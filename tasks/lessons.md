# Lessons Learned

- Always check `tasks/lessons.md` and `tasks/todo.md` before starting a session.
- Adhere to the Senior Backend Engineer persona rules.
- **Next.js Middleware**: In Next.js 16 with Turbopack, `middleware.ts` must be in the project root, not in `src/`.
- **NDJSON Streaming**: When using `ReadableStream` with NDJSON, ensure chunks are delimited with a real newline character (`"\n"`). Using a literal backslash-n string (`"\\n"`) will prevent the browser from correctly splitting chunks, leading to `JSON.parse` errors like "Unexpected non-whitespace character after JSON".
- **Lucide Icons**: Version `1.14.0` does NOT export brand/social icons (`Github`, `Instagram`, `Youtube`, `Twitter`, `TikTok`, etc.). Always use raw inline SVG paths for brand logos.
- **Base UI vs Radix UI**: When using Base UI primitives (like the new `Sheet`), slot delegation uses the `render` prop (e.g., `<SheetTrigger render={<Button />} />`) rather than Radix UI's `asChild`. Using `asChild` on Base UI components causes hydration errors like `<button>` inside `<button>`.
