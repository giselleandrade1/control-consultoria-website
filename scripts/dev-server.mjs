import { createReadStream, statSync, watch } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const clients = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

const liveReloadSnippet = `
<script>
(() => {
  const events = new EventSource("/__dev/events");
  events.addEventListener("reload", () => window.location.reload());
})();
</script>`;

const noStore = { "Cache-Control": "no-store" };

const isSafePath = (filePath) => filePath === root || filePath.startsWith(`${root}${sep}`);

const filePathFromRequest = async (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const pathname = decoded === "/" ? "/index.html" : decoded;
  let filePath = resolve(root, `.${normalize(pathname)}`);
  if (!isSafePath(filePath)) return null;
  const details = await stat(filePath).catch(() => null);
  if (details?.isDirectory()) filePath = join(filePath, "index.html");
  return filePath;
};

const send = (response, status, body, headers = {}) => {
  response.writeHead(status, headers);
  response.end(body);
};

const sendHtml = (response, body) => {
  send(response, 200, body, {
    "Content-Type": "text/html; charset=utf-8",
    ...noStore
  });
};

const sendLiveReload = (request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  response.write(":ok\n\n");
  clients.add(response);
  request.on("close", () => clients.delete(response));
};

const broadcastReload = () => {
  clients.forEach((client) => client.write("event: reload\ndata: changed\n\n"));
};

const serveStaticFile = async (request, response) => {
  if ((request.url || "").split("?")[0] === "/favicon.ico") {
    request.url = "/assets/images/favicon-32.png";
  }
  const filePath = await filePathFromRequest(request.url || "/");
  if (!filePath) return send(response, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });

  try {
    const extension = extname(filePath);
    const contentType = mimeTypes[extension] || "application/octet-stream";
    if (extension === ".html") {
      const html = await readFile(filePath, "utf8");
      return sendHtml(response, html.replace("</body>", `${liveReloadSnippet}</body>`));
    }
    const details = statSync(filePath);
    response.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": details.size,
      ...noStore
    });
    createReadStream(filePath).pipe(response);
  } catch {
    send(response, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
  }
};

const responsivePreviewHtml = () => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Responsive Preview Local</title>
  <style>${responsivePreviewCss}</style>
</head>
<body>
  <main class="tool">
    <form class="toolbar" data-toolbar>
      <label>Device <select data-preset></select></label>
      <label>Path <input data-path value="/" spellcheck="false"></label>
      <label>Width <input data-width type="number" min="240" max="7680" value="390"></label>
      <label>Height <input data-height type="number" min="240" max="4320" value="844"></label>
      <button type="button" data-rotate aria-label="Rotacionar viewport">↻</button>
      <label>Zoom <select data-zoom>
        <option value="fit">Fit</option>
        <option value=".5">50%</option>
        <option value=".67">67%</option>
        <option value=".75">75%</option>
        <option value=".8">80%</option>
        <option value=".9">90%</option>
        <option value="1">100%</option>
      </select></label>
      <fieldset>
        <legend>Tema</legend>
        <button type="button" data-theme="light" aria-pressed="true">Light</button>
        <button type="button" data-theme="dark" aria-pressed="false">Dark</button>
      </fieldset>
      <fieldset>
        <legend>Idioma</legend>
        <button type="button" data-language="pt-BR" aria-pressed="true">PT-BR</button>
        <button type="button" data-language="en" aria-pressed="false">EN</button>
        <button type="button" data-language="es" aria-pressed="false">ES</button>
      </fieldset>
    </form>

    <section class="summary" aria-live="polite">
      <strong data-size>390 × 844</strong>
      <span data-meta>Mobile · Portrait · Fit</span>
    </section>

    <section class="stage" data-stage>
      <div class="viewport-box" data-box>
        <div class="resizer resizer-left" data-resize-left aria-hidden="true"></div>
        <div class="viewport" data-viewport>
          <iframe data-frame title="Website real"></iframe>
        </div>
        <div class="resizer resizer-right" data-resize-right aria-hidden="true"></div>
      </div>
    </section>
  </main>
  <script>${responsivePreviewJs}</script>
  ${liveReloadSnippet}
</body>
</html>`;

const responsivePreviewCss = `
:root {
  color-scheme: light;
  --bg: #eef2f5;
  --panel: #ffffff;
  --text: #18202a;
  --muted: #687586;
  --line: #cfd8e3;
  --accent: #2f7f1f;
  --shadow: 0 18px 42px rgba(32, 43, 56, .14);
}
* { box-sizing: border-box; }
html, body { min-width: 320px; margin: 0; }
body {
  min-height: 100svh;
  background: var(--bg);
  color: var(--text);
  font: 13px/1.4 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
button, input, select { font: inherit; }
button { cursor: pointer; }
.tool { min-height: 100svh; display: grid; grid-template-rows: auto auto 1fr; }
.toolbar {
  position: sticky;
  z-index: 3;
  top: 0;
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 8px;
  overflow-x: auto;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, .96);
  backdrop-filter: blur(10px);
}
label { display: grid; gap: 3px; color: var(--muted); font-size: 11px; font-weight: 750; white-space: nowrap; }
select, input, .toolbar button {
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
  color: var(--text);
}
select { padding: 5px 28px 5px 8px; }
input { width: 84px; padding: 5px 8px; }
[data-path] { width: 130px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.toolbar button { min-width: 36px; padding: 5px 9px; font-weight: 750; }
fieldset {
  min-width: max-content;
  display: flex;
  align-items: end;
  gap: 3px;
  margin: 0;
  padding: 0;
  border: 0;
}
legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
fieldset button[aria-pressed="true"] {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}
.summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
  background: #f8fafc;
}
.summary strong { font-size: 14px; }
.summary span { color: var(--muted); }
.stage {
  min-height: 0;
  overflow: auto;
  display: grid;
  place-items: start center;
  padding: 18px;
}
.viewport-box {
  position: relative;
  transform-origin: top center;
}
.viewport {
  width: 390px;
  height: 844px;
  overflow: hidden;
  border: 1px solid #222b35;
  border-radius: 4px;
  background: #fff;
  box-shadow: var(--shadow);
}
iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  background: #fff;
}
.resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 14px;
  cursor: ew-resize;
}
.resizer::before {
  content: "";
  position: absolute;
  top: 50%;
  width: 3px;
  height: 42px;
  border-radius: 999px;
  background: rgba(24, 32, 42, .26);
  transform: translateY(-50%);
}
.resizer-left { right: 100%; }
.resizer-right { left: 100%; }
.resizer-left::before { right: 5px; }
.resizer-right::before { left: 5px; }
@media (max-width: 720px) {
  .toolbar { align-items: stretch; }
  .summary { align-items: flex-start; flex-direction: column; gap: 2px; }
  .stage { padding: 12px; }
}
`;

const responsivePreviewJs = `
(() => {
  const presets = [
    ["Mobile", "320 × 568", 320, 568], ["Mobile", "360 × 640", 360, 640],
    ["Mobile", "375 × 667", 375, 667], ["Mobile", "375 × 812", 375, 812],
    ["Mobile", "390 × 844", 390, 844], ["Mobile", "393 × 873", 393, 873],
    ["Mobile", "412 × 915", 412, 915], ["Mobile", "430 × 932", 430, 932],
    ["Tablet", "600 × 960", 600, 960], ["Tablet", "768 × 1024", 768, 1024],
    ["Tablet", "820 × 1180", 820, 1180], ["Tablet", "834 × 1194", 834, 1194],
    ["Tablet", "1024 × 1366", 1024, 1366],
    ["Laptop", "1024 × 768", 1024, 768], ["Laptop", "1280 × 720", 1280, 720],
    ["Laptop", "1366 × 768", 1366, 768], ["Laptop", "1440 × 900", 1440, 900],
    ["Laptop", "1536 × 864", 1536, 864],
    ["Desktop", "1600 × 900", 1600, 900], ["Desktop", "1920 × 1080", 1920, 1080],
    ["Desktop", "1920 × 1200", 1920, 1200],
    ["Large", "2560 × 1440", 2560, 1440], ["Large", "3440 × 1440", 3440, 1440],
    ["Large", "3840 × 2160", 3840, 2160]
  ].map(([category, label, width, height]) => ({ category, label, width, height }));

  const state = { width: 390, height: 844, zoom: "fit", theme: "light", language: "pt-BR", path: "/" };
  const preset = document.querySelector("[data-preset]");
  const widthInput = document.querySelector("[data-width]");
  const heightInput = document.querySelector("[data-height]");
  const pathInput = document.querySelector("[data-path]");
  const zoomSelect = document.querySelector("[data-zoom]");
  const stage = document.querySelector("[data-stage]");
  const box = document.querySelector("[data-box]");
  const viewport = document.querySelector("[data-viewport]");
  const frame = document.querySelector("[data-frame]");
  const size = document.querySelector("[data-size]");
  const meta = document.querySelector("[data-meta]");

  const byCategory = presets.reduce((groups, item) => {
    groups[item.category] ||= [];
    groups[item.category].push(item);
    return groups;
  }, {});

  preset.innerHTML = Object.entries(byCategory).map(([category, items]) => (
    "<optgroup label=\\"" + category + "\\">" +
    items.map((item) => "<option value=\\"" + item.width + "x" + item.height + "\\">" + item.label + "</option>").join("") +
    "</optgroup>"
  )).join("") + "<option value=\\"custom\\">Custom</option>";
  preset.value = "390x844";

  const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);
  const orientation = () => state.width > state.height ? "Landscape" : "Portrait";
  const category = () => {
    if (state.width >= 2500) return "Large";
    if (state.width >= 1600) return "Desktop";
    if (state.width >= 1024) return "Laptop";
    if (state.width >= 600) return "Tablet";
    return "Mobile";
  };
  const currentScale = () => {
    if (state.zoom !== "fit") return Number(state.zoom);
    const availableWidth = Math.max(280, stage.clientWidth - 36);
    const availableHeight = Math.max(280, stage.clientHeight - 36);
    return Math.min(1, availableWidth / state.width, availableHeight / state.height);
  };
  const safePath = (value) => {
    let path = String(value || "/").trim() || "/";
    if (!path.startsWith("/")) path = "/" + path;
    if (path.startsWith("/dev/responsive")) path = "/";
    return path;
  };
  const setPressed = (selector, value) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.theme === value || button.dataset.language === value));
    });
  };
  const selectedPreset = () => presets.find((item) => item.width === state.width && item.height === state.height);
  const syncPreset = () => {
    const selected = selectedPreset();
    preset.value = selected ? selected.width + "x" + selected.height : "custom";
  };
  const syncRealThemeAndLanguage = () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    const root = doc.documentElement;
    const themeButton = doc.querySelector("[data-theme-toggle]");
    if (themeButton && root.dataset.theme !== state.theme) themeButton.click();
    const languageButton = doc.querySelector("[data-language-option=\\"" + state.language + "\\"]");
    if (languageButton && root.lang !== state.language) languageButton.click();
  };
  const updateFrame = () => {
    const path = safePath(state.path);
    if (frame.dataset.path !== path) {
      frame.dataset.path = path;
      frame.src = path;
    } else {
      syncRealThemeAndLanguage();
    }
  };
  const render = () => {
    state.width = clamp(state.width, 240, 7680);
    state.height = clamp(state.height, 240, 4320);
    const scale = currentScale();
    viewport.style.width = state.width + "px";
    viewport.style.height = state.height + "px";
    box.style.width = Math.ceil(state.width * scale) + "px";
    box.style.height = Math.ceil(state.height * scale) + "px";
    box.style.transform = "scale(" + scale + ")";
    widthInput.value = state.width;
    heightInput.value = state.height;
    pathInput.value = safePath(state.path);
    syncPreset();
    setPressed("[data-theme]", state.theme);
    setPressed("[data-language]", state.language);
    size.textContent = state.width + " × " + state.height;
    meta.textContent = category() + " · " + orientation() + " · " + (state.zoom === "fit" ? "Fit" : Math.round(Number(state.zoom) * 100) + "%");
    updateFrame();
  };
  const setSize = (width, height) => { state.width = width; state.height = height; render(); };
  const startResize = (event, direction) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = state.width;
    const scale = currentScale();
    const move = (moveEvent) => {
      const delta = (moveEvent.clientX - startX) / scale * direction;
      setSize(Math.round(startWidth + delta), state.height);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  };

  preset.addEventListener("change", () => {
    if (preset.value === "custom") return;
    const [width, height] = preset.value.split("x").map(Number);
    setSize(width, height);
  });
  widthInput.addEventListener("input", () => setSize(widthInput.value, state.height));
  heightInput.addEventListener("input", () => setSize(state.width, heightInput.value));
  pathInput.addEventListener("input", () => { state.path = pathInput.value; updateFrame(); });
  document.querySelector("[data-rotate]").addEventListener("click", () => setSize(state.height, state.width));
  zoomSelect.addEventListener("change", () => { state.zoom = zoomSelect.value; render(); });
  document.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
    state.theme = button.dataset.theme;
    render();
  }));
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
    state.language = button.dataset.language;
    render();
  }));
  document.querySelector("[data-resize-left]").addEventListener("pointerdown", (event) => startResize(event, -1));
  document.querySelector("[data-resize-right]").addEventListener("pointerdown", (event) => startResize(event, 1));
  frame.addEventListener("load", () => setTimeout(syncRealThemeAndLanguage, 80));
  new ResizeObserver(() => { if (state.zoom === "fit") render(); }).observe(stage);
  render();
})();
`;

const server = createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname;
  if (pathname === "/__dev/events") return sendLiveReload(request, response);
  if (pathname === "/dev/responsive" || pathname === "/dev/responsive/") return sendHtml(response, responsivePreviewHtml());
  return serveStaticFile(request, response);
});

watch(root, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  const normalized = String(filename).replaceAll("\\\\", "/");
  if (normalized.startsWith(".git/") || normalized === "package.json") return;
  clearTimeout(globalThis.__reloadTimer);
  globalThis.__reloadTimer = setTimeout(broadcastReload, 80);
});

server.listen(port, host, () => {
  console.log(`Website: http://${host}:${port}/`);
  console.log(`Responsive Preview: http://${host}:${port}/dev/responsive`);
});
