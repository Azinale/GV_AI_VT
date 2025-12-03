# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## PDF Viewer: "Read PDF" feature

The app includes a `Viewer` component that can render PDFs and extract text. The UI now includes a "Trích xuất văn bản" (Extract Text) button and a "Đọc PDF" (Read PDF) button that reads the extracted text aloud via the browser Speech Synthesis API.

To make sure this works out of the box, the app uses the following CDN scripts (already added to `index.html`):

- `pdf.js` (and worker)
- `mammoth` for DOCX conversion
- `jQuery`, `jszip`, `pptxjs` for PPTX

If you prefer NPM, you can replace the CDN approach and install `pdfjs-dist` and `mammoth` and import them directly.

Usage:
- Open a PDF in the app using the existing file picker or by passing a URL to `activeFile`.
- Click "Trích xuất văn bản" to extract all text from the PDF pages; extracted text will appear in a panel.
- Click "Đọc PDF" to read the extracted text aloud. Click again to stop.
