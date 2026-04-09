const PLATFORM_THEMES = {
  Instagram: { color: "#E1306C" },
  LinkedIn: { color: "#0A66C2" },
  Twitter: { color: "#6B7280" },
  Facebook: { color: "#1877F2" },
  GitHub: { color: "#8B5CF6" },
  Discord: { color: "#5865F2" },
  TikTok: { color: "#00C4B8" },
  Snapchat: { color: "#D4AF00" },
};

// Inline SVG paths for each platform icon (mirrors icons.svg sprite exactly)
const PLATFORM_SVG = {
  Instagram: `<rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>`,
  LinkedIn: `<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><line stroke="currentColor" stroke-width="2" x1="8" y1="11" x2="8" y2="17"/><line stroke="currentColor" stroke-width="2" x1="8" y1="7" x2="8" y2="7.01"/><circle cx="8" cy="7" r="1" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2" d="M12 17v-4c0-1.66 1.34-3 3-3s2 .67 2 2v5"/>`,
  Twitter: `<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.733-8.835L2.25 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`,
  Facebook: `<path fill="none" stroke="currentColor" stroke-width="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>`,
  GitHub: `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>`,
  Discord: `<path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>`,
  TikTok: `<path fill="none" stroke="currentColor" stroke-width="2" d="M12 3v12a4 4 0 11-3-3.87"/><path fill="none" stroke="currentColor" stroke-width="2" d="M12 3c0 0 1 3 5 4"/>`,
  Snapchat: `<path fill="currentColor" d="M12.004 2c-1.667 0-4.55.464-4.55 4.03v.37c0 .397-.018.785-.05 1.16-.302.12-.638.19-.988.19-.29 0-.554-.053-.766-.14-.148-.061-.297-.022-.36.09-.064.11-.026.254.093.343.486.364 1.073.595 1.722.668.12.624.457 1.07.822 1.07.065 0 .13-.01.194-.027.294-.08.59-.12.876-.12.32 0 .626.048.909.14.254.082.546.125.85.125.303 0 .594-.043.847-.125.283-.092.59-.14.91-.14.286 0 .58.04.875.12.064.017.13.027.194.027.365 0 .703-.446.822-1.07.65-.073 1.236-.304 1.722-.668.12-.09.157-.233.093-.343-.063-.112-.212-.151-.36-.09-.212.087-.477.14-.766.14-.35 0-.686-.07-.988-.19a14.87 14.87 0 0 1-.05-1.16v-.37C16.554 2.464 13.67 2 12.004 2zm0 14.6c-1.35 0-2.59-.386-3.634-1.05-.245.045-.497.068-.748.068-.78 0-1.54-.2-2.154-.553-.098-.056-.21-.015-.248.093-.04.107.015.233.126.3.74.437 1.61.7 2.556.745.217.46.647.79 1.15.79.127 0 .255-.022.378-.065.463-.162.965-.248 1.574-.248.61 0 1.11.086 1.575.248.123.043.25.065.378.065.503 0 .933-.33 1.15-.79.946-.045 1.816-.308 2.556-.745.112-.067.166-.193.126-.3-.038-.108-.15-.149-.248-.093-.614.354-1.374.553-2.154.553-.25 0-.503-.023-.748-.067A6.535 6.535 0 0 1 12.004 16.6z"/>`,
};

const NODE_W = 160,
  NODE_H = 40,
  PERSON_W = 180,
  PERSON_H = 48,
  CUSTOM_W = 160,
  CUSTOM_H = 40;

function getNodeDims(node) {
  if (node.type === "person") return { w: PERSON_W, h: PERSON_H };
  if (node.type === "custom") return { w: CUSTOM_W, h: CUSTOM_H };
  return { w: NODE_W, h: NODE_H };
}

function getCenter(node) {
  const { w, h } = getNodeDims(node);
  return { cx: node.x + w / 2, cy: node.y + h / 2 };
}

function buildSVG(nodes, edges) {
  if (nodes.length === 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100"><text x="20" y="50" fill="#aaa" font-size="14">Graphe vide</text></svg>';
  }

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs) - 40;
  const minY = Math.min(...ys) - 40;
  const maxX = Math.max(...xs.map((x, i) => x + getNodeDims(nodes[i]).w)) + 40;
  const maxY = Math.max(...ys.map((y, i) => y + getNodeDims(nodes[i]).h)) + 40;
  const vw = maxX - minX;
  const vh = maxY - minY;

  const edgeSVG = edges
    .map((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return "";
      const from = getCenter(fromNode);
      const to = getCenter(toNode);
      const platformName =
        toNode.type === "platform"
          ? toNode.data.platform
          : fromNode.data?.platform;
      const edgeColor =
        toNode.type === "custom"
          ? toNode.data.color
          : fromNode.type === "custom"
            ? fromNode.data.color
            : (PLATFORM_THEMES[platformName] || { color: "#ccc" }).color;
      return `
      <line x1="${from.cx}" y1="${from.cy}" x2="${to.cx}" y2="${to.cy}" stroke="${edgeColor}" stroke-width="2" opacity="0.35"/>
      <line x1="${from.cx}" y1="${from.cy}" x2="${to.cx}" y2="${to.cy}" stroke="${edgeColor}" stroke-width="1" opacity="0.6" stroke-dasharray="4 4"/>
    `;
    })
    .join("");

  const nodeSVG = nodes
    .map((node) => {
      if (node.type === "person") {
        const initials = node.data.name
          .split(" ")
          .map((w) => w[0])
          .join("");
        const emailShort =
          node.data.email.length > 22
            ? node.data.email.slice(0, 22) + "..."
            : node.data.email;
        return `
        <g transform="translate(${node.x}, ${node.y})">
          <rect width="${PERSON_W}" height="${PERSON_H}" rx="0" fill="#ffffff" stroke="#000000" stroke-width="2"/>
          <rect x="6" y="6" width="36" height="36" rx="0" fill="#d85E33"/>
          <text x="24" y="${PERSON_H / 2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">${initials}</text>
          <text x="52" y="${PERSON_H / 2 - 6}" fill="#000000" font-size="11" font-weight="700" font-family="sans-serif">${node.data.name}</text>
          <text x="52" y="${PERSON_H / 2 + 8}" fill="#555555" font-size="9" font-family="monospace">${emailShort}</text>
        </g>
      `;
      }
      if (node.type === "custom") {
        const col = node.data.color || "#3fb950";
        const titleShort =
          node.data.title.length > 14
            ? node.data.title.slice(0, 14) + "…"
            : node.data.title;
        const contentLabel =
          node.data.contents.length > 0
            ? `${node.data.contents.length} élément${node.data.contents.length !== 1 ? "s" : ""}`
            : "noeud";
        return `
        <g transform="translate(${node.x}, ${node.y})">
          <rect width="${CUSTOM_W}" height="${CUSTOM_H}" rx="0" fill="#ffffff" stroke="#000000" stroke-width="2"/>
          <rect x="4" y="4" width="32" height="32" rx="0" fill="${col}"/>
          <text x="44" y="${CUSTOM_H / 2 - 4}" fill="#000000" font-size="11" font-weight="700" font-family="sans-serif">${titleShort}</text>
          <text x="44" y="${CUSTOM_H / 2 + 9}" fill="#555555" font-size="9" font-family="monospace">${contentLabel}</text>
        </g>
      `;
      }
      // platform node
      const theme = PLATFORM_THEMES[node.data.platform] || { color: "#888" };
      const svgContent = PLATFORM_SVG[node.data.platform] || "";
      const usernameShort =
        node.data.username.length > 16
          ? node.data.username.slice(0, 16) + "..."
          : node.data.username;
      return `
      <g transform="translate(${node.x}, ${node.y})">
        <rect width="${NODE_W}" height="${NODE_H}" rx="0" fill="#ffffff" stroke="#000000" stroke-width="2"/>
        <rect x="4" y="4" width="32" height="32" rx="0" fill="${theme.color}"/>
        <svg x="8" y="8" width="24" height="24" viewBox="0 0 24 24">
          ${svgContent.replace(/stroke="currentColor"/g, 'stroke="#ffffff"').replace(/fill="currentColor"/g, 'fill="#ffffff"')}
        </svg>
        <text x="44" y="${NODE_H / 2 - 4}" fill="#000000" font-size="11" font-weight="700" font-family="sans-serif">${node.data.platform}</text>
        <text x="44" y="${NODE_H / 2 + 9}" fill="#555555" font-size="9" font-family="monospace">${usernameShort}</text>
      </g>
    `;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${vw} ${vh}" width="${vw}" height="${vh}" style="max-width:100%">
    <rect x="${minX}" y="${minY}" width="${vw}" height="${vh}" fill="#f5f0e8"/>
    ${edgeSVG}
    ${nodeSVG}
  </svg>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function platformIconSVG(platform, color) {
  const svgContent = PLATFORM_SVG[platform] || "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">${svgContent.replace(/stroke="currentColor"/g, `stroke="${color}"`).replace(/fill="currentColor"/g, `fill="${color}"`)}</svg>`;
}

function buildNodeCards(nodes) {
  return nodes
    .map((node) => {
      if (node.type === "person") {
        const initials = node.data.name
          .split(" ")
          .map((w) => w[0])
          .join("");
        return `
        <div class="card card-person">
          <div class="card-header">
            <div class="avatar">${escapeHtml(initials)}</div>
            <div class="card-info">
              <div class="card-title">${escapeHtml(node.data.name)}</div>
              <div class="card-sub">${escapeHtml(node.data.email)}</div>
            </div>
            <span class="badge badge-person">Cible</span>
          </div>
          <div class="card-body">
            <div class="field"><span class="label">Plateformes trouvées</span><span class="value">${node.data.platformCount}</span></div>
          </div>
        </div>
      `;
      }
      if (node.type === "platform") {
        const theme = PLATFORM_THEMES[node.data.platform] || { color: "#888" };
        return `
        <div class="card" style="border-top:3px solid ${theme.color}">
          <div class="card-header">
            <div class="platform-icon" style="background:${theme.color}">
              ${platformIconSVG(node.data.platform, "#ffffff")}
            </div>
            <div class="card-info">
              <div class="card-title">${escapeHtml(node.data.platform)}</div>
              <div class="card-sub" style="color:${theme.color}">@${escapeHtml(node.data.username)}</div>
            </div>
            <span class="badge" style="background:${theme.color};color:#fff;border-color:${theme.color}">Plateforme</span>
          </div>
          <div class="card-body">
            ${node.data.bio ? `<div class="field"><span class="label">Bio</span><span class="value">${escapeHtml(node.data.bio)}</span></div>` : ""}
            ${node.data.url ? `<div class="field"><span class="label">URL</span><span class="value mono"><a href="${escapeHtml(node.data.url)}" target="_blank" rel="noopener" style="color:${theme.color}">${escapeHtml(node.data.url)}</a></span></div>` : ""}
            <div class="field"><span class="label">Statut</span><span class="badge badge-found">Trouvé</span></div>
          </div>
        </div>
      `;
      }
      // custom node
      const col = node.data.color || "#3fb950";
      const contentsHTML = node.data.contents
        .map((item) => {
          if (item.type === "text") {
            return `<div class="field"><span class="label">Texte</span><span class="value">${escapeHtml(item.value)}</span></div>`;
          }
          if (item.type === "link") {
            return `<div class="field"><span class="label">Lien</span><span class="value mono"><a href="${escapeHtml(item.value)}" target="_blank" rel="noopener" style="color:${col}">${escapeHtml(item.label || item.value)}</a></span></div>`;
          }
          if (item.type === "image" && item.value) {
            return `<div class="field"><span class="label">Image</span><img src="${escapeHtml(item.value)}" alt="" style="max-width:200px;border:2px solid #000;margin-top:4px;display:block"/></div>`;
          }
          return "";
        })
        .join("");
      return `
      <div class="card" style="border-top:3px solid ${col}">
        <div class="card-header">
          <div class="custom-icon" style="background:${col}">✦</div>
          <div class="card-info">
            <div class="card-title">${escapeHtml(node.data.title)}</div>
            <div class="card-sub">${node.data.contents.length} élément${node.data.contents.length !== 1 ? "s" : ""}</div>
          </div>
          <span class="badge" style="background:${col};color:#fff;border-color:${col}">Personnalisé</span>
        </div>
        <div class="card-body">
          ${contentsHTML || '<span class="label">Aucun contenu</span>'}
        </div>
      </div>
    `;
    })
    .join("");
}

export function generateReport(graph, timestamp) {
  const date = new Date(timestamp).toLocaleString("fr-FR");
  const svg = buildSVG(graph.nodes, graph.edges);
  const cards = buildNodeCards(graph.nodes);
  const personCount = graph.nodes.filter((n) => n.type === "person").length;
  const platformCount = graph.nodes.filter((n) => n.type === "platform").length;
  const customCount = graph.nodes.filter((n) => n.type === "custom").length;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Rapport OSINT — ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f5f0e8; color: #000000; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 24px; max-width: 980px; margin: 0 auto; }

    /* Header */
    .report-header { border: 2px solid #000; background: #fff; padding: 20px 24px; margin-bottom: 24px; box-shadow: 4px 4px 0 #000; }
    h1 { font-size: 22px; font-weight: 700; color: #000; margin-bottom: 4px; }
    .accent { color: #d85E33; }
    .meta { color: #555; font-size: 12px; margin-top: 6px; font-family: 'JetBrains Mono', monospace; }

    /* Stats */
    .stats { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: #fff; border: 2px solid #000; padding: 14px 20px; box-shadow: 3px 3px 0 #000; flex: 1; min-width: 100px; }
    .stat-n { font-size: 28px; font-weight: 700; color: #d85E33; line-height: 1; }
    .stat-l { font-size: 11px; color: #555; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }

    /* Sections */
    .section { margin-bottom: 36px; }
    h2 { font-size: 13px; font-weight: 700; color: #000; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; }
    h2::before { content: ''; display: inline-block; width: 12px; height: 12px; background: #d85E33; flex-shrink: 0; }

    /* Graph */
    .graph-wrap { background: #f5f0e8; border: 2px solid #000; padding: 24px; overflow-x: auto; box-shadow: 4px 4px 0 #000; }

    /* Cards */
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
    .card { background: #fff; border: 2px solid #000; overflow: hidden; box-shadow: 3px 3px 0 #000; }
    .card-person { border-top: 3px solid #d85E33; }
    .card-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 2px solid #000; }
    .card-info { flex: 1; min-width: 0; }
    .card-title { font-size: 13px; font-weight: 700; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-sub { font-size: 11px; color: #555; font-family: 'JetBrains Mono', monospace; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; }
    .field { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    .value { font-size: 12px; color: #222; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    /* Avatars & icons */
    .avatar { width: 36px; height: 36px; background: #d85E33; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; flex-shrink: 0; font-family: monospace; }
    .platform-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .custom-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; }

    /* Badges */
    .badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border: 2px solid #000; white-space: nowrap; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-person { background: #d85E33; color: #fff; border-color: #000; }
    .badge-found { background: #3fb950; color: #fff; border-color: #000; }

    /* Links */
    a { color: inherit; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Footer */
    footer { margin-top: 48px; padding-top: 16px; border-top: 2px solid #000; color: #888; font-size: 11px; text-align: center; font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>
  <div class="report-header">
    <h1><span class="accent">OSINT</span> — Rapport de liens</h1>
    <div class="meta">Généré le ${date} &nbsp;·&nbsp; ${graph.nodes.length} nœuds &nbsp;·&nbsp; ${graph.edges.length} liens</div>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-n">${personCount}</div><div class="stat-l">Cible${personCount !== 1 ? "s" : ""}</div></div>
    <div class="stat"><div class="stat-n">${platformCount}</div><div class="stat-l">Plateforme${platformCount !== 1 ? "s" : ""}</div></div>
    <div class="stat"><div class="stat-n">${customCount}</div><div class="stat-l">Nœud${customCount !== 1 ? "s" : ""} perso</div></div>
    <div class="stat"><div class="stat-n">${graph.edges.length}</div><div class="stat-l">Lien${graph.edges.length !== 1 ? "s" : ""}</div></div>
  </div>

  <div class="section">
    <h2>Graphe de liens</h2>
    <div class="graph-wrap">${svg}</div>
  </div>

  <div class="section">
    <h2>Fiches détaillées</h2>
    <div class="cards">${cards}</div>
  </div>

  <footer>Rapport généré par OSINT Desktop</footer>
</body>
</html>`;
}
