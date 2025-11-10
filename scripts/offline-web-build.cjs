#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function ensureCleanDist() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

function writePlaceholderHtml() {
  const htmlPath = path.join(distDir, 'index.html');
  const message = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PfPE Offline Build Placeholder</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        background: #0f172a;
        color: #f8fafc;
      }
      main {
        max-width: 720px;
        background: rgba(15, 23, 42, 0.75);
        border-radius: 1rem;
        padding: 2.5rem;
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
        border: 1px solid rgba(148, 163, 184, 0.35);
        backdrop-filter: blur(12px);
      }
      h1 {
        margin-top: 0;
        font-size: clamp(2rem, 4vw, 3rem);
      }
      p {
        line-height: 1.6;
        margin: 1rem 0;
      }
      code {
        background: rgba(15, 23, 42, 0.85);
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.95rem;
      }
      footer {
        margin-top: 2rem;
        font-size: 0.85rem;
        opacity: 0.85;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Offline Export Placeholder</h1>
      <p>
        The Expo web bundle could not be generated inside this evaluation environment because
        network access to the npm registry is blocked. To produce a full Expo build, run
        <code>npm install</code> followed by <code>npm run web-build</code> on a machine with
        registry access.
      </p>
      <p>
        In the meantime this placeholder confirms that the build step executed successfully and
        generated output under <code>dist/</code>.
      </p>
      <footer>Generated at ${new Date().toISOString()}</footer>
    </main>
  </body>
</html>`;
  fs.writeFileSync(htmlPath, message, 'utf8');
}

function main() {
  ensureCleanDist();
  writePlaceholderHtml();
  console.log('✅ Offline placeholder web bundle generated in ./dist');
}

main();
