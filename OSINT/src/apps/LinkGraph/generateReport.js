const PLATFORM_THEMES = {
  Instagram: { color: "#E1306C", bg: "#2a0f18" },
  LinkedIn: { color: "#0A66C2", bg: "#0a1a2e" },
  Twitter: { color: "#9CA0A5", bg: "#151618" },
  Facebook: { color: "#1877F2", bg: "#0b1a30" },
  GitHub: { color: "#8B5CF6", bg: "#1a1030" },
  Discord: { color: "#5865F2", bg: "#141530" },
  TikTok: { color: "#00F2EA", bg: "#0a2020" },
  Snapchat: { color: "#FFFC00", bg: "#1e1e0a" },
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
    return '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100"><text x="20" y="50" fill="#888" font-size="14">Graphe vide</text></svg>';
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
            : (PLATFORM_THEMES[platformName] || { color: "#555" }).color;
      return `
      <line x1="${from.cx}" y1="${from.cy}" x2="${to.cx}" y2="${to.cy}" stroke="${edgeColor}" stroke-width="3" opacity="0.15"/>
      <line x1="${from.cx}" y1="${from.cy}" x2="${to.cx}" y2="${to.cy}" stroke="${edgeColor}" stroke-width="1.5" opacity="0.5" stroke-dasharray="4 4"/>
      <circle cx="${(from.cx + to.cx) / 2}" cy="${(from.cy + to.cy) / 2}" r="2" fill="${edgeColor}" opacity="0.4"/>
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
          <rect width="${PERSON_W}" height="${PERSON_H}" rx="10" fill="#1a1018" stroke="rgba(233,84,32,0.4)" stroke-width="1"/>
          <circle cx="26" cy="${PERSON_H / 2}" r="14" fill="rgba(233,84,32,0.15)" stroke="rgba(233,84,32,0.3)" stroke-width="1"/>
          <text x="26" y="${PERSON_H / 2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="#d85E33" font-size="12" font-weight="700" font-family="monospace">${initials}</text>
          <text x="48" y="${PERSON_H / 2 - 5}" fill="#fff" font-size="13" font-weight="600" font-family="sans-serif">${node.data.name}</text>
          <text x="48" y="${PERSON_H / 2 + 10}" fill="#888" font-size="10" font-family="monospace">${emailShort}</text>
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
            ? `${node.data.contents.length} element${node.data.contents.length !== 1 ? "s" : ""}`
            : "noeud";
        return `
        <g transform="translate(${node.x}, ${node.y})">
          <rect width="${CUSTOM_W}" height="${CUSTOM_H}" rx="8" fill="#111118" stroke="${col}55" stroke-width="1"/>
          <rect x="4" y="4" width="32" height="32" rx="7" fill="${col}22"/>
          <text x="42" y="${CUSTOM_H / 2 - 4}" fill="#fff" font-size="12" font-weight="600" font-family="sans-serif">${titleShort}</text>
          <text x="42" y="${CUSTOM_H / 2 + 10}" fill="${col}" font-size="10" font-family="monospace" opacity="0.8">${contentLabel}</text>
        </g>
      `;
      }
      // platform
      const theme = PLATFORM_THEMES[node.data.platform] || {
        color: "#888",
        bg: "#1a1a1a",
      };
      const usernameShort =
        node.data.username.length > 16
          ? node.data.username.slice(0, 16) + "..."
          : node.data.username;
      return `
      <g transform="translate(${node.x}, ${node.y})">
        <rect width="${NODE_W}" height="${NODE_H}" rx="8" fill="${theme.bg}" stroke="${theme.color}55" stroke-width="1"/>
        <rect x="4" y="4" width="32" height="32" rx="7" fill="${theme.color}22"/>
        <text x="42" y="${NODE_H / 2 - 4}" fill="#fff" font-size="12" font-weight="600" font-family="sans-serif">${node.data.platform}</text>
        <text x="42" y="${NODE_H / 2 + 10}" fill="${theme.color}" font-size="10" font-family="monospace" opacity="0.8">${usernameShort}</text>
      </g>
    `;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${vw} ${vh}" width="${vw}" height="${vh}" style="max-width:100%">
    <rect x="${minX}" y="${minY}" width="${vw}" height="${vh}" fill="#0a0a10"/>
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
            <div>
              <div class="card-title">${escapeHtml(node.data.name)}</div>
              <div class="card-sub">${escapeHtml(node.data.email)}</div>
            </div>
            <span class="badge badge-person">Personne</span>
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
        <div class="card" style="border-color:${theme.color}33">
          <div class="card-header">
            <div class="platform-dot" style="background:${theme.color}"></div>
            <div>
              <div class="card-title">${escapeHtml(node.data.platform)}</div>
              <div class="card-sub" style="color:${theme.color}">${escapeHtml(node.data.username)}</div>
            </div>
            <span class="badge" style="background:${theme.color}22;color:${theme.color};border-color:${theme.color}44">Plateforme</span>
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
            return `<div class="field"><span class="label">Image</span><img src="${escapeHtml(item.value)}" alt="" style="max-width:200px;border-radius:6px;margin-top:4px;display:block"/></div>`;
          }
          return "";
        })
        .join("");
      return `
      <div class="card" style="border-color:${col}33">
        <div class="card-header">
          <div class="custom-icon" style="background:${col}22;border:1px solid ${col}44;color:${col}">✦</div>
          <div>
            <div class="card-title">${escapeHtml(node.data.title)}</div>
            <div class="card-sub">${node.data.contents.length} élément${node.data.contents.length !== 1 ? "s" : ""}</div>
          </div>
          <span class="badge" style="background:${col}22;color:${col};border-color:${col}44">Noeud personnalisé</span>
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
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a10; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px 24px; max-width: 960px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 32px; font-family: monospace; }
    .accent { color: #d85E33; }
    .stats { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
    .stat { background: #111118; border: 1px solid #222; border-radius: 8px; padding: 12px 20px; }
    .stat-n { font-size: 24px; font-weight: 700; color: #d85E33; }
    .stat-l { font-size: 12px; color: #666; margin-top: 2px; }
    h2 { font-size: 16px; font-weight: 600; color: #aaa; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #1e1e28; padding-bottom: 8px; }
    .section { margin-bottom: 40px; }
    .graph-wrap { background: #0a0a10; border: 1px solid #1e1e28; border-radius: 12px; padding: 24px; overflow-x: auto; margin-bottom: 8px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .card { background: #111118; border: 1px solid #1e1e28; border-radius: 10px; overflow: hidden; }
    .card-person { border-color: rgba(233,84,32,0.3); }
    .card-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #1e1e28; }
    .card-title { font-size: 14px; font-weight: 600; color: #fff; }
    .card-sub { font-size: 12px; color: #666; font-family: monospace; margin-top: 2px; }
    .card-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
    .field { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 13px; color: #ccc; }
    .mono { font-family: monospace; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(233,84,32,0.15); border: 1px solid rgba(233,84,32,0.3); display: flex; align-items: center; justify-content: center; color: #d85E33; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .platform-dot { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; }
    .custom-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; border: 1px solid; white-space: nowrap; margin-left: auto; flex-shrink: 0; }
    .badge-person { background: rgba(233,84,32,0.15); color: #d85E33; border-color: rgba(233,84,32,0.3); }
    .badge-found { background: rgba(63,185,80,0.15); color: #3fb950; border-color: rgba(63,185,80,0.3); }
    a { text-decoration: none; }
    a:hover { text-decoration: underline; }
    footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #1e1e28; color: #444; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <h1><span class="accent">OSINT</span> — Rapport de liens</h1>
  <div class="meta">Généré le ${date} &nbsp;·&nbsp; ${graph.nodes.length} nœuds &nbsp;·&nbsp; ${graph.edges.length} liens</div>

  <div class="stats">
    <div class="stat"><div class="stat-n">${personCount}</div><div class="stat-l">Cible${personCount !== 1 ? "s" : ""}</div></div>
    <div class="stat"><div class="stat-n">${platformCount}</div><div class="stat-l">Plateforme${platformCount !== 1 ? "s" : ""}</div></div>
    <div class="stat"><div class="stat-n">${customCount}</div><div class="stat-l">Nœud${customCount !== 1 ? "s" : ""} personnalisé${customCount !== 1 ? "s" : ""}</div></div>
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
