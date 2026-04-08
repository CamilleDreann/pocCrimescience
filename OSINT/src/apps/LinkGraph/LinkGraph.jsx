import { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { useOS } from "../../context/useOS";
import Icon from "../../components/ui/Icon";
import styles from "./LinkGraph.module.css";
import { getChildren, addFile } from "../FileManager/fileSystemData";
import { generateReport } from "./generateReport";
import {
  $graph,
  addCustomNode,
  clearGraph,
  updateNodePosition,
  removeNode,
  updateNode,
  uid,
} from "../../stores/graphStore";
import { $messages, addMessage } from "../../stores/messagesStore";
import Popup from "../../components/ui/Popup";
import {
  initFaceRecognition,
  checkGraphForTarget,
} from "../../services/faceRecognition";
import { completeObjective } from "../../stores/objectivesStore";

const PLATFORM_THEMES = {
  Instagram: { color: "#E1306C", bg: "#ffffff" },
  LinkedIn: { color: "#0A66C2", bg: "#ffffff" },
  Twitter: { color: "#9CA0A5", bg: "#ffffff" },
  Facebook: { color: "#1877F2", bg: "#ffffff" },
  GitHub: { color: "#8B5CF6", bg: "#ffffff" },
  Discord: { color: "#5865F2", bg: "#ffffff" },
  TikTok: { color: "#00F2EA", bg: "#ffffff" },
  Snapchat: { color: "#FFFC00", bg: "#ffffff" },
};

const PLATFORM_ICONS = {
  Instagram: "platform-instagram",
  LinkedIn: "platform-linkedin",
  Twitter: "platform-twitter",
  Facebook: "platform-facebook",
  GitHub: "platform-github",
  Discord: "platform-discord",
  TikTok: "platform-tiktok",
  Snapchat: "platform-snapchat",
};

const ICON_OPTIONS = [
  "search",
  "link-graph",
  "osint-search",
  "terminal",
  "text-editor",
  "file",
  "settings",
  "platform-instagram",
  "platform-twitter",
  "platform-github",
  "platform-linkedin",
  "platform-discord",
  "platform-tiktok",
  "platform-facebook",
  "platform-snapchat",
];

const COLOR_OPTIONS = [
  "#d85E33",
  "#3fb950",
  "#58a6ff",
  "#E1306C",
  "#8B5CF6",
  "#f0a500",
  "#00F2EA",
  "#888888",
];

const NODE_W = 160;
const NODE_H = 40;
const PERSON_W = 180;
const PERSON_H = 48;
const CUSTOM_W = 160;
const CUSTOM_H = 40;

function AddNodePanel({ onConfirm, onCancel, onOpenFilePicker, initialValues, isEdit }) {
  const [icon, setIcon] = useState(initialValues?.icon ?? "search");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [color, setColor] = useState(initialValues?.color ?? "#3fb950");
  const [contents, setContents] = useState(initialValues?.contents ?? []);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const contentMenuRef = useRef(null);

  useEffect(() => {
    if (!showContentMenu) return;
    const handleClickOutside = (e) => {
      if (
        contentMenuRef.current &&
        !contentMenuRef.current.contains(e.target)
      ) {
        setShowContentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showContentMenu]);

  const addContent = (type) => {
    setShowContentMenu(false);
    if (type === "text")
      setContents((c) => [...c, { type: "text", value: "" }]);
    if (type === "link")
      setContents((c) => [...c, { type: "link", value: "", label: "" }]);
    if (type === "image")
      setContents((c) => [...c, { type: "image", value: "" }]);
  };

  const updateContent = (i, patch) => {
    setContents((c) =>
      c.map((item, idx) => (idx === i ? { ...item, ...patch } : item)),
    );
  };

  const removeContent = (i) => {
    setContents((c) => c.filter((_, idx) => idx !== i));
  };

  const handleConfirm = () => {
    if (!title.trim()) return;
    onConfirm({ icon, title: title.trim(), color, contents });
  };

  return (
    <div
      className={styles.addNodePanel}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={styles.addNodePanelHeader}>
        <span>{isEdit ? "Modifier le nœud" : "Nouveau noeud"}</span>
        <button className={styles.sidebarClose} onClick={onCancel}>
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className={styles.addNodePanelBody}>
        {/* Title */}
        <div className={styles.addNodeField}>
          <label className={styles.addNodeLabel}>Titre</label>
          <input
            className={styles.addNodeInput}
            placeholder="Nom du noeud..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            autoFocus
          />
        </div>

        {/* Color */}
        <div className={styles.addNodeField}>
          <label className={styles.addNodeLabel}>Couleur</label>
          <div className={styles.colorPicker}>
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ""}`}
                style={{
                  background: c,
                  boxShadow:
                    color === c
                      ? `0 0 0 2px #111118, 0 0 0 4px ${c}`
                      : undefined,
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div className={styles.addNodeField}>
          <label className={styles.addNodeLabel}>Icone</label>
          <div className={styles.iconGrid}>
            {ICON_OPTIONS.map((ic) => (
              <button
                key={ic}
                className={`${styles.iconOption} ${icon === ic ? styles.iconOptionActive : ""}`}
                style={
                  icon === ic
                    ? { borderColor: color, background: `${color}22` }
                    : {}
                }
                onClick={() => setIcon(ic)}
                title={ic}
              >
                <Icon
                  name={ic}
                  size={16}
                  color={icon === ic ? color : "#666"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Contents */}
        <div className={styles.addNodeField}>
          <label className={styles.addNodeLabel}>Contenu</label>
          <div className={styles.contentList}>
            {contents.map((item, i) => (
              <div key={i} className={styles.contentItem}>
                <span className={styles.contentTypeBadge}>{item.type}</span>
                <div className={styles.contentInputs}>
                  {item.type === "text" && (
                    <textarea
                      className={styles.addNodeTextarea}
                      placeholder="Texte..."
                      value={item.value}
                      onChange={(e) =>
                        updateContent(i, { value: e.target.value })
                      }
                      rows={2}
                    />
                  )}
                  {item.type === "link" && (
                    <>
                      <input
                        className={styles.addNodeInput}
                        placeholder="URL..."
                        value={item.value}
                        onChange={(e) =>
                          updateContent(i, { value: e.target.value })
                        }
                      />
                      <input
                        className={styles.addNodeInput}
                        placeholder="Label (optionnel)..."
                        value={item.label}
                        onChange={(e) =>
                          updateContent(i, { label: e.target.value })
                        }
                      />
                    </>
                  )}
                  {item.type === "image" && (
                    <div className={styles.imagePickerWrap}>
                      <button
                        className={styles.imagePickerBtn}
                        onClick={() => {
                          onOpenFilePicker((content) =>
                            updateContent(i, { value: content }),
                          );
                        }}
                      >
                        {item.value ? "Changer l'image" : "Choisir une image"}
                      </button>
                      {item.value && (
                        <img
                          src={item.value}
                          alt="preview"
                          className={styles.imagePickerPreview}
                        />
                      )}
                    </div>
                  )}
                </div>
                <button
                  className={styles.contentRemoveBtn}
                  onClick={() => removeContent(i)}
                >
                  <Icon name="close" size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.addContentWrap} ref={contentMenuRef}>
            <button
              className={`${styles.addContentBtn} ${showContentMenu ? styles.addContentBtnOpen : ""}`}
              onClick={() => setShowContentMenu((m) => !m)}
            >
              + Ajouter du contenu
            </button>
            {showContentMenu && (
              <div className={styles.contentTypeMenu}>
                <button onClick={() => addContent("text")}>Texte</button>
                <button onClick={() => addContent("link")}>Lien</button>
                <button onClick={() => addContent("image")}>Image</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.addNodePanelFooter}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Annuler
        </button>
        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={!title.trim()}
        >
          {isEdit ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}

export default function LinkGraph() {
  const { openApp } = useOS();
  const graph = useStore($graph);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [addNodeModal, setAddNodeModal] = useState(null); // { sourceNodeId, sourceX, sourceY }
  const [editingNode, setEditingNode] = useState(null); // node being edited
  const [filePicker, setFilePicker] = useState(null); // { onSelect: fn } | null
  const [filePickerPath, setFilePickerPath] = useState("/home");
  const [reportPreview, setReportPreview] = useState(null); // { html, filename, timestamp } | null
  const [sendStep, setSendStep] = useState(null); // null | 'selectRecipient'
  const [popupError, setPopupError] = useState(null); // null | string
  const [faceCheckLoading, setFaceCheckLoading] = useState(false);
  const [faceModelStatus, setFaceModelStatus] = useState("idle"); // 'idle' | 'loading' | 'ready' | 'error'
  const messages = useStore($messages);

  useEffect(() => {
    const hasJulien = graph.nodes.some(
      (n) => n.type === "person" && n.data?.email === "julien.caron@gmail.com",
    );
    if (hasJulien && faceModelStatus === "ready") {
      completeObjective("obj-morel-1");
    }
  }, [graph.nodes, faceModelStatus]);

  const getSelectedNodeColor = () => {
    if (!selectedNode) return "var(--color-border)";
    if (selectedNode.type === "person") return "#d85E33";
    if (selectedNode.type === "custom")
      return selectedNode.data.color || "#3fb950";
    if (selectedNode.type === "platform")
      return (PLATFORM_THEMES[selectedNode.data.platform] || { color: "#888" })
        .color;
    return "var(--color-border)";
  };

  useEffect(() => {
    const id = requestIdleCallback(() => {
      setFaceModelStatus("loading");
      initFaceRecognition()
        .then(() => setFaceModelStatus("ready"))
        .catch(() => setFaceModelStatus("error"));
    });
    return () => cancelIdleCallback(id);
  }, []);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });

  const onNodeMouseDown = useCallback((e, node) => {
    e.stopPropagation();
    setDragging(node.id);
    setSelectedNode(node);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  }, []);

  const onCanvasMouseDown = useCallback(
    (e) => {
      if (e.target === svgRef.current || e.target.tagName === "rect") {
        setIsPanning(true);
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          panX: pan.x,
          panY: pan.y,
        };
        setSelectedNode(null);
      }
    },
    [pan],
  );

  const onMouseMove = useCallback(
    (e) => {
      if (dragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const nx = dragStart.current.nodeX + dx;
        const ny = dragStart.current.nodeY + dy;
        updateNodePosition(dragging, nx, ny);
        setSelectedNode((prev) =>
          prev && prev.id === dragging ? { ...prev, x: nx, y: ny } : prev,
        );
      } else if (isPanning) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPan({
          x: panStart.current.panX + dx,
          y: panStart.current.panY + dy,
        });
      }
    },
    [dragging, isPanning],
  );

  const onMouseUp = useCallback(() => {
    setDragging(null);
    setIsPanning(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const getNodeCenter = (node) => {
    const w =
      node.type === "person"
        ? PERSON_W
        : node.type === "custom"
          ? CUSTOM_W
          : NODE_W;
    const h =
      node.type === "person"
        ? PERSON_H
        : node.type === "custom"
          ? CUSTOM_H
          : NODE_H;
    return { cx: node.x + w / 2, cy: node.y + h / 2 };
  };

  const getNodeDims = (node) => {
    if (node.type === "person") return { w: PERSON_W, h: PERSON_H };
    if (node.type === "custom") return { w: CUSTOM_W, h: CUSTOM_H };
    return { w: NODE_W, h: NODE_H };
  };

  const handleAddNode = useCallback(
    (data) => {
      const { sourceNodeId, sourceX, sourceY } = addNodeModal;
      const newId = uid();
      const newNode = {
        id: newId,
        type: "custom",
        x: sourceX + 220,
        y: sourceY,
        data,
      };
      const newEdge = {
        id: `e${sourceNodeId}-${newId}`,
        from: sourceNodeId,
        to: newId,
      };
      addCustomNode(newNode, newEdge);
      const sourceNode = graph.nodes.find((n) => n.id === sourceNodeId);
      const hasImage = data.contents?.some((c) => c.type === "image");
      if (hasImage && sourceNode?.data?.platform === "Instagram") {
        completeObjective("obj-morel-2");
      }
      setAddNodeModal(null);
    },
    [addNodeModal, graph],
  );

  const isEmpty = graph.nodes.length === 0;

  const handleGenerateReport = useCallback(() => {
    const timestamp = Date.now();
    const dateStr = new Date(timestamp).toISOString().slice(0, 10);
    const filename = `rapport-${dateStr}-${timestamp}.pdf`;
    const html = generateReport(graph, timestamp);
    setReportPreview({ html, filename, timestamp, dateStr });
  }, [graph]);

  const recipients = messages
    .filter((m) => m.render && m.from !== "Systeme")
    .reduce((acc, m) => {
      if (!acc.find((r) => r.from === m.from))
        acc.push({ from: m.from, role: m.role, avatar: m.avatar });
      return acc;
    }, []);

  const handleSendReport = useCallback(() => {
    setSendStep("selectRecipient");
  }, []);

  const handleSelectRecipient = useCallback(
    async (recipient) => {
      if (recipient.from !== "Capitaine Morel") {
        setPopupError(
          `Vous avez sélectionné "${recipient.from}". Ce n'est pas le bon destinataire. C'est un travail sérieux, vous ne pouvez pas vous permettre une erreur comme celle-ci.`,
        );
        return;
      }
      if (!reportPreview) return;

      setFaceCheckLoading(true);
      try {
        await initFaceRecognition();
        const faceResult = await checkGraphForTarget(graph.nodes);
        if (!faceResult.found) {
          const reasons = {
            no_images:
              "Votre graphe ne contient aucune image. Vous devez identifier visuellement le suspect avant d'envoyer le rapport.",
            no_face:
              "Aucun visage n'a été détecté dans les images de votre graphe. Assurez-vous d'ajouter une image claire du suspect.",
            no_match:
              "Le suspect recherché n'a pas été identifié dans votre graphe. Vérifiez vos éléments avant de soumettre le rapport.",
          };
          setPopupError(
            reasons[faceResult.reason] || "Le rapport est incomplet.",
          );
          return;
        }
      } catch (err) {
        console.error("Analyse faciale échouée :", err);
        setPopupError("Erreur lors de l'analyse faciale. Veuillez réessayer.");
        return;
      } finally {
        setFaceCheckLoading(false);
      }

      const { html, filename, timestamp, dateStr } = reportPreview;
      const path = `/home/Documents/Rapports/${filename}`;
      const sizeKB = (new Blob([html]).size / 1024).toFixed(1);
      addFile(path, {
        type: "file",
        name: filename,
        size: `${sizeKB} KB`,
        modified: dateStr,
        content: html,
      });
      const missionMsgId = `msg-report-${timestamp}`;
      addMessage({
        id: missionMsgId,
        from: "Capitaine Morel",
        role: "Brigade Criminelle",
        avatar: "CM",
        subject: "Re: Rapport reçu — Nouvelles instructions",
        date: new Date(Date.now() + 1000).toISOString(),
        body: `Agent,

L’appel à témoins est en cours de diffusion. Les premiers retours ne tarderont pas.

En attendant, j’ai besoin de vous sur une nouvelle piste. Regardez attentivement le reportage ci-joint : il contient des éléments visuels qui pourraient nous permettre de localiser le fugitif.

Vos nouveaux objectifs sont ci-dessous. Restez concentré.

Capitaine Morel`,
        readed: false,
        render: false,
        video: "/REPORTAGE.mp4",
        videoObjectives: [
          { "id": "obj-video-1", "label": "Regarder la vidéo et trouver un élément permettant de situer le fugitif." },
          { "id": "obj-video-2", "label": "Rajouter un noeud au Link Graph avec votre trouvaille." },
          { "id": "obj-video-3", "label": "Faire un rapport au capitaine Morel." }
        ],
      });
      addMessage({
        id: `msg-felicitations-${timestamp}`,
        from: "Capitaine Morel",
        role: "Brigade Criminelle",
        avatar: "CM",
        subject: "Re: Rapport reçu",
        date: new Date().toISOString(),
        body: `Excellent travail, agent.

Je tenais à vous féliciter pour votre efficacité sur cette phase de l’enquête. Votre analyse a payé : on a enfin un portrait identifié qui tient la route. C’est du solide.

Grâce à ça, je lance l’appel à témoins dès maintenant. On va diffuser le visuel à grande échelle pour forcer le destin et voir qui sort du bois.

Pendant que la Brigade traite les retours, prenez le temps de visionner cette vidéo de sensibilisation — elle fait partie de votre formation et ne devrait pas vous prendre longtemps.

On reste sur le coup, on n’a jamais été aussi proches du but.

Capitaine Morel`,
        readed: false,
        render: true,
        video: "/REPORTAGE.mp4",
        onVideoEnd: missionMsgId,
      });
      completeObjective("obj-morel-3");
      setReportPreview(null);
      setSendStep(null);
    },
    [reportPreview, graph.nodes],
  );

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.toolbarIcon}>
            <Icon name="link-graph" size={14} />
          </div>
          <span className={styles.toolbarTitle}>Graphe de liens</span>
        </div>
        <div className={styles.toolbarRight}>
          {graph.nodes.length > 0 && (
            <>
              <span className={styles.nodeCount}>
                {graph.nodes.filter((n) => n.type === "person").length} cible
                {graph.nodes.filter((n) => n.type === "person").length !== 1
                  ? "s"
                  : ""}
              </span>
              <span className={styles.separator}>|</span>
              <span className={styles.nodeCount}>
                {graph.nodes.length} noeuds
              </span>
              <span className={styles.separator}>|</span>
              <button className={styles.clearBtn} onClick={clearGraph}>
                <Icon name="close" size={12} />
                <span>Vider</span>
              </button>
              <button
                className={styles.reportBtn}
                onClick={handleGenerateReport}
              >
                <Icon name="file" size={12} />
                <span>Rapport</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.workspace}>
        {/* Graph canvas */}
        <div className={styles.canvasWrap}>
          {isEmpty ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyGrid}>
                <div className={styles.emptyGridInner} />
              </div>
              <div className={styles.emptyContent}>
                <div className={styles.emptyIconWrap}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle
                      cx="14"
                      cy="14"
                      r="6"
                      stroke="#d85E33"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <circle
                      cx="34"
                      cy="14"
                      r="4"
                      stroke="#5865F2"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <circle
                      cx="24"
                      cy="36"
                      r="5"
                      stroke="#3fb950"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <line
                      x1="19"
                      y1="16"
                      x2="30"
                      y2="14"
                      stroke="#444"
                      strokeWidth="1"
                    />
                    <line
                      x1="16"
                      y1="19"
                      x2="22"
                      y2="32"
                      stroke="#444"
                      strokeWidth="1"
                    />
                    <line
                      x1="32"
                      y1="18"
                      x2="26"
                      y2="32"
                      stroke="#444"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <p className={styles.emptyTitle}>Graphe de liens</p>
                <p className={styles.emptyText}>
                  Lancez une recherche OSINT puis exportez les resultats ici
                </p>
                <button
                  className={styles.openSearchBtn}
                  onClick={() =>
                    openApp({
                      appId: "osint-search",
                      title: "OSINT Search",
                      icon: "osint-search",
                      defaultSize: { width: 820, height: 580 },
                    })
                  }
                >
                  <Icon name="osint-search" size={16} />
                  <span>Ouvrir OSINT Search</span>
                </button>
              </div>
            </div>
          ) : (
            <svg
              ref={svgRef}
              className={styles.canvas}
              onMouseDown={onCanvasMouseDown}
              style={{
                cursor: isPanning ? "grabbing" : dragging ? "grabbing" : "grab",
              }}
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y})`}>
                {/* Background grid */}
                <rect
                  x="-5000"
                  y="-5000"
                  width="10000"
                  height="10000"
                  fill="url(#grid)"
                />

                {/* Edges */}
                {graph.edges.map((edge) => {
                  const fromNode = graph.nodes.find((n) => n.id === edge.from);
                  const toNode = graph.nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  const from = getNodeCenter(fromNode);
                  const to = getNodeCenter(toNode);
                  const platformName =
                    toNode.type === "platform"
                      ? toNode.data.platform
                      : fromNode.data?.platform;
                  const edgeColor =
                    toNode.type === "custom"
                      ? toNode.data.color
                      : fromNode.type === "custom"
                        ? fromNode.data.color
                        : (PLATFORM_THEMES[platformName] || { color: "#555" })
                            .color;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={from.cx}
                        y1={from.cy}
                        x2={to.cx}
                        y2={to.cy}
                        stroke={edgeColor}
                        strokeWidth="3"
                        opacity="0.15"
                      />
                      <line
                        x1={from.cx}
                        y1={from.cy}
                        x2={to.cx}
                        y2={to.cy}
                        stroke={edgeColor}
                        strokeWidth="1.5"
                        opacity="0.5"
                        strokeDasharray={
                          selectedNode &&
                          (selectedNode.id === edge.from ||
                            selectedNode.id === edge.to)
                            ? "none"
                            : "4 4"
                        }
                      />
                      <circle
                        cx={(from.cx + to.cx) / 2}
                        cy={(from.cy + to.cy) / 2}
                        r="2"
                        fill={edgeColor}
                        opacity="0.4"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {graph.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;

                  if (node.type === "person") {
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseDown={(e) => onNodeMouseDown(e, node)}
                        style={{ cursor: "pointer" }}
                        className={styles.nodeGroup}
                      >
                        <rect
                          x="4"
                          y="4"
                          width={PERSON_W}
                          height={PERSON_H}
                          rx="10"
                          fill="#d85E33"
                        />
                        <g
                          style={{
                            transition: "transform 0.15s ease",
                            transform: isSelected
                              ? "translate(3px, 3px)"
                              : "translate(0px, 0px)",
                          }}
                        >
                          <rect
                            width={PERSON_W}
                            height={PERSON_H}
                            rx="10"
                            fill="#ffffff"
                            stroke="#d85E33"
                            strokeWidth={1.5}
                          />
                          <circle
                            cx="26"
                            cy={PERSON_H / 2}
                            r="14"
                            fill="rgba(233,84,32,0.15)"
                            stroke="rgba(233,84,32,0.3)"
                            strokeWidth="1"
                          />
                          <text
                            x="26"
                            y={PERSON_H / 2 + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#d85E33"
                            fontSize="12"
                            fontWeight="700"
                            fontFamily="var(--font-sans)"
                          >
                            {node.data.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </text>
                          <text
                            x="48"
                            y={PERSON_H / 2 - 5}
                            fill="#111"
                            fontSize="13"
                            fontWeight="600"
                            fontFamily="var(--font-sans)"
                          >
                            {node.data.name}
                          </text>
                          <text
                            x="48"
                            y={PERSON_H / 2 + 10}
                            fill="#555"
                            fontSize="10"
                            fontFamily="var(--font-mono)"
                          >
                            {node.data.email.length > 22
                              ? node.data.email.slice(0, 22) + "..."
                              : node.data.email}
                          </text>
                        </g>
                      </g>
                    );
                  }

                  if (node.type === "custom") {
                    const col = node.data.color || "#3fb950";
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseDown={(e) => onNodeMouseDown(e, node)}
                        style={{ cursor: "pointer" }}
                        className={styles.nodeGroup}
                      >
                        <rect
                          x="4"
                          y="4"
                          width={CUSTOM_W}
                          height={CUSTOM_H}
                          rx="8"
                          fill={col}
                        />
                        <g
                          style={{
                            transition: "transform 0.15s ease",
                            transform: isSelected
                              ? "translate(3px, 3px)"
                              : "translate(0px, 0px)",
                          }}
                        >
                          <rect
                            width={CUSTOM_W}
                            height={CUSTOM_H}
                            rx="8"
                            fill="#ffffff"
                            stroke={col}
                            strokeWidth={1.5}
                          />
                          <rect
                            x="4"
                            y="4"
                            width="32"
                            height="32"
                            rx="7"
                            fill={`${col}22`}
                          />
                          <foreignObject x="8" y="8" width="24" height="24">
                            <div
                              xmlns="http://www.w3.org/1999/xhtml"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <Icon
                                name={node.data.icon}
                                size={16}
                                color={col}
                              />
                            </div>
                          </foreignObject>
                          <text
                            x="42"
                            y={CUSTOM_H / 2 - 4}
                            fill="#111"
                            fontSize="12"
                            fontWeight="600"
                            fontFamily="var(--font-sans)"
                          >
                            {node.data.title.length > 14
                              ? node.data.title.slice(0, 14) + "…"
                              : node.data.title}
                          </text>
                          <text
                            x="42"
                            y={CUSTOM_H / 2 + 10}
                            fill={col}
                            fontSize="10"
                            fontFamily="var(--font-mono)"
                            opacity="0.8"
                          >
                            {node.data.contents.length > 0
                              ? `${node.data.contents.length} element${node.data.contents.length !== 1 ? "s" : ""}`
                              : "noeud"}
                          </text>
                        </g>
                      </g>
                    );
                  }

                  // Platform node
                  const theme = PLATFORM_THEMES[node.data.platform] || {
                    color: "#888",
                    bg: "#ffffff",
                  };
                  const iconName =
                    PLATFORM_ICONS[node.data.platform] || "search";

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={(e) => onNodeMouseDown(e, node)}
                      style={{ cursor: "pointer" }}
                      className={styles.nodeGroup}
                    >
                      <rect
                        x="4"
                        y="4"
                        width={NODE_W}
                        height={NODE_H}
                        rx="8"
                        fill={theme.color}
                      />
                      <g
                        style={{
                          transition: "transform 0.15s ease",
                          transform: isSelected
                            ? "translate(3px, 3px)"
                            : "translate(0px, 0px)",
                        }}
                      >
                        <rect
                          width={NODE_W}
                          height={NODE_H}
                          rx="8"
                          fill={theme.bg}
                          stroke={theme.color}
                          strokeWidth={1.5}
                        />
                        <rect
                          x="4"
                          y="4"
                          width="32"
                          height="32"
                          rx="7"
                          fill={`${theme.color}22`}
                        />
                        <foreignObject x="8" y="8" width="24" height="24">
                          <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Icon
                              name={iconName}
                              size={16}
                              color={theme.color}
                            />
                          </div>
                        </foreignObject>
                        <text
                          x="42"
                          y={NODE_H / 2 - 4}
                          fill="#111"
                          fontSize="12"
                          fontWeight="600"
                          fontFamily="var(--font-sans)"
                        >
                          {node.data.platform}
                        </text>
                        <text
                          x="42"
                          y={NODE_H / 2 + 10}
                          fill={theme.color}
                          fontSize="10"
                          fontFamily="var(--font-mono)"
                          opacity="0.8"
                        >
                          {node.data.username.length > 16
                            ? node.data.username.slice(0, 16) + "..."
                            : node.data.username}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* "+" button on hovered node */}
                {selectedNode && !addNodeModal && (
                  <g
                    transform={`translate(${selectedNode.x + getNodeDims(selectedNode).w + 8}, ${selectedNode.y + getNodeDims(selectedNode).h / 2 - 12})`}
                  >
                    <foreignObject x="-12" y="-12" width="48" height="48">
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className={styles.addNodeBtn}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddNodeModal({
                              sourceNodeId: selectedNode.id,
                              sourceX: selectedNode.x,
                              sourceY: selectedNode.y,
                            });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </foreignObject>
                  </g>
                )}
              </g>
            </svg>
          )}

          {/* Add node panel overlay */}
          {addNodeModal && (
            <AddNodePanel
              onConfirm={handleAddNode}
              onCancel={() => setAddNodeModal(null)}
              onOpenFilePicker={(onSelect) => {
                setFilePickerPath("/home");
                setFilePicker({ onSelect });
              }}
            />
          )}
          {editingNode && (
            <AddNodePanel
              isEdit
              initialValues={editingNode.data}
              onConfirm={(data) => {
                updateNode(editingNode.id, data);
                setSelectedNode((prev) =>
                  prev?.id === editingNode.id
                    ? { ...prev, data: { ...prev.data, ...data } }
                    : prev,
                );
                setEditingNode(null);
              }}
              onCancel={() => setEditingNode(null)}
              onOpenFilePicker={(onSelect) => {
                setFilePickerPath("/home");
                setFilePicker({ onSelect });
              }}
            />
          )}
        </div>

        {/* Detail sidebar */}
        {selectedNode && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Details</span>
              <div className={styles.sidebarHeaderActions}>
                <button
                  className={styles.sidebarDelete}
                  style={{ "--btn-color": "#e74c3c" }}
                  onClick={() => {
                    removeNode(selectedNode.id);
                    setSelectedNode(null);
                  }}
                  title="Supprimer le nœud"
                >
                  <Icon name="trash" size={14} />
                </button>
                {selectedNode.type === "custom" && (
                  <button
                    className={styles.sidebarEdit}
                    style={{ "--btn-color": getSelectedNodeColor() }}
                    onClick={() => setEditingNode(selectedNode)}
                    title="Modifier le nœud"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                )}
                <button
                  className={styles.sidebarClose}
                  onClick={() => setSelectedNode(null)}
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            </div>

            {selectedNode.type === "person" ? (
              <div className={styles.sidebarBody}>
                <div className={styles.detailAvatar}>
                  <span className={styles.detailAvatarText}>
                    {selectedNode.data.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Nom</span>
                  <span className={styles.detailValue}>
                    {selectedNode.data.name}
                  </span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Email</span>
                  <span
                    className={`${styles.detailValue} ${styles.detailMono}`}
                  >
                    {selectedNode.data.email}
                  </span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Plateformes</span>
                  <span className={styles.detailValue}>
                    {selectedNode.data.platformCount} comptes trouves
                  </span>
                </div>
                <div className={styles.detailDivider} />
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Type</span>
                  <span className={styles.detailBadge}>Personne</span>
                </div>
              </div>
            ) : selectedNode.type === "custom" ? (
              <div className={styles.sidebarBody}>
                <div
                  className={styles.detailPlatformBanner}
                  style={{
                    background: `linear-gradient(135deg, ${selectedNode.data.color}33, transparent)`,
                  }}
                >
                  <Icon
                    name={selectedNode.data.icon}
                    size={28}
                    color={selectedNode.data.color}
                  />
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Titre</span>
                  <span className={styles.detailValue}>
                    {selectedNode.data.title}
                  </span>
                </div>
                <div className={styles.detailDivider} />
                {selectedNode.data.contents.length === 0 ? (
                  <span className={styles.detailLabel}>Aucun contenu</span>
                ) : (
                  selectedNode.data.contents.map((item, i) => (
                    <div key={i} className={styles.detailSection}>
                      <span className={styles.detailLabel}>{item.type}</span>
                      {item.type === "text" && (
                        <span className={styles.detailValue}>{item.value}</span>
                      )}
                      {item.type === "link" && item.value && (
                        <a
                          href={item.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.detailValue} ${styles.detailUrl} ${styles.detailMono}`}
                          style={{ color: selectedNode.data.color }}
                        >
                          {item.label || item.value}
                        </a>
                      )}
                      {item.type === "image" && item.value && (
                        <img
                          src={item.value}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            borderRadius: 6,
                            marginTop: 4,
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
                <div className={styles.detailDivider} />
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Type</span>
                  <span
                    className={styles.detailBadge}
                    style={{
                      background: `${selectedNode.data.color}22`,
                      color: selectedNode.data.color,
                      borderColor: `${selectedNode.data.color}44`,
                    }}
                  >
                    Noeud personnalise
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.sidebarBody}>
                <div
                  className={styles.detailPlatformBanner}
                  style={{
                    background: `linear-gradient(135deg, ${(PLATFORM_THEMES[selectedNode.data.platform] || { color: "#888" }).color}33, transparent)`,
                  }}
                >
                  <Icon
                    name={
                      PLATFORM_ICONS[selectedNode.data.platform] || "search"
                    }
                    size={28}
                    color={
                      (
                        PLATFORM_THEMES[selectedNode.data.platform] || {
                          color: "#888",
                        }
                      ).color
                    }
                  />
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Plateforme</span>
                  <span className={styles.detailValue}>
                    {selectedNode.data.platform}
                  </span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Identifiant</span>
                  <span
                    className={`${styles.detailValue} ${styles.detailMono}`}
                    style={{
                      color: (
                        PLATFORM_THEMES[selectedNode.data.platform] || {
                          color: "#888",
                        }
                      ).color,
                    }}
                  >
                    {selectedNode.data.username}
                  </span>
                </div>
                {selectedNode.data.bio && (
                  <div className={styles.detailSection}>
                    <span className={styles.detailLabel}>Bio</span>
                    <span className={styles.detailValue}>
                      {selectedNode.data.bio}
                    </span>
                  </div>
                )}
                {selectedNode.data.url && (
                  <div className={styles.detailSection}>
                    <span className={styles.detailLabel}>URL</span>
                    <span
                      className={`${styles.detailValue} ${styles.detailMono} ${styles.detailUrl}`}
                    >
                      {selectedNode.data.url}
                    </span>
                  </div>
                )}
                <div className={styles.detailDivider} />
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Statut</span>
                  <span
                    className={`${styles.detailBadge} ${styles.badgeSuccess}`}
                  >
                    Trouve
                  </span>
                </div>
                {selectedNode.data.platform === "Instagram" &&
                  selectedNode.data.found &&
                  selectedNode.data.posts && (
                    <button
                      className={styles.viewProfileBtn}
                      data-platform="instagram"
                      onClick={() => {
                        openApp({
                          appId: "instagram-viewer",
                          title: `Instagram — ${selectedNode.data.username}`,
                          icon: "platform-instagram",
                          defaultSize: { width: 420, height: 650 },
                          props: { profile: selectedNode.data },
                          multiInstance: true,
                        });
                      }}
                    >
                      <Icon
                        name="platform-instagram"
                        size={16}
                        color="#E1306C"
                      />
                      <span>Consulter le profil</span>
                    </button>
                  )}
                {selectedNode.data.platform === "Strava" &&
                  selectedNode.data.found &&
                  selectedNode.data.activities && (
                    <button
                      className={styles.viewProfileBtn}
                      data-platform="strava"
                      onClick={() => {
                        openApp({
                          appId: "strava-viewer",
                          title: `Strava — ${selectedNode.data.username}`,
                          icon: "platform-strava",
                          defaultSize: { width: 820, height: 580 },
                          props: { profile: selectedNode.data },
                          multiInstance: true,
                        });
                      }}
                    >
                      <span>🚴</span>
                      <span>Consulter le profil</span>
                    </button>
                  )}
                {selectedNode.data.platform === "LinkedIn" &&
                  selectedNode.data.found && (
                    <button
                      className={styles.viewProfileBtn}
                      data-platform="linkedin"
                      onClick={() => {
                        openApp({
                          appId: "linkedin-viewer",
                          title: `LinkedIn — ${selectedNode.data.username}`,
                          icon: "platform-linkedin",
                          defaultSize: { width: 480, height: 680 },
                          props: { profile: selectedNode.data },
                          multiInstance: true,
                        });
                      }}
                    >
                      <Icon name="platform-linkedin" size={16} color="#0A66C2" />
                      <span>Consulter le profil</span>
                    </button>
                  )}
                {selectedNode.data.platform === "Twitter" &&
                  selectedNode.data.found && (
                    <button
                      className={styles.viewProfileBtn}
                      data-platform="twitter"
                      onClick={() => {
                        openApp({
                          appId: "twitter-viewer",
                          title: `Twitter — ${selectedNode.data.username}`,
                          icon: "platform-twitter",
                          defaultSize: { width: 480, height: 580 },
                          props: { profile: selectedNode.data },
                          multiInstance: true,
                        });
                      }}
                    >
                      <Icon name="platform-twitter" size={16} color="#9CA0A5" />
                      <span>Consulter le profil</span>
                    </button>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Virtual File Picker modal */}
      {filePicker && (
        <div
          className={styles.filePickerOverlay}
          onClick={() => setFilePicker(null)}
        >
          <div
            className={styles.filePickerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.filePickerHeader}>
              <span className={styles.filePickerTitle}>Choisir une image</span>
              <button
                className={styles.filePickerClose}
                onClick={() => setFilePicker(null)}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            <div className={styles.filePickerBreadcrumb}>
              {filePickerPath
                .split("/")
                .filter(Boolean)
                .map((part, i, arr) => (
                  <span key={i}>
                    <button
                      className={styles.filePickerBreadcrumbBtn}
                      onClick={() =>
                        setFilePickerPath("/" + arr.slice(0, i + 1).join("/"))
                      }
                    >
                      {part}
                    </button>
                    {i < arr.length - 1 && (
                      <span className={styles.filePickerSep}>/</span>
                    )}
                  </span>
                ))}
            </div>
            <div className={styles.filePickerGrid}>
              {filePickerPath !== "/home" && (
                <button
                  className={styles.filePickerItem}
                  onClick={() =>
                    setFilePickerPath(
                      filePickerPath.split("/").slice(0, -1).join("/") ||
                        "/home",
                    )
                  }
                >
                  <Icon name="folder" size={28} color="#d85E33" />
                  <span>..</span>
                </button>
              )}
              {getChildren(filePickerPath).map((item) => {
                const isImage =
                  item.type === "file" &&
                  /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item.name);
                const hasContent = item.type === "file" && !!item.content;
                return (
                  <button
                    key={item.path}
                    className={`${styles.filePickerItem} ${isImage && !hasContent ? styles.filePickerItemDim : ""}`}
                    onClick={() => {
                      if (item.type === "folder") {
                        setFilePickerPath(item.path);
                      } else if (hasContent) {
                        filePicker.onSelect(item.content);
                        setFilePicker(null);
                      }
                    }}
                    title={
                      !hasContent && item.type === "file"
                        ? "Aucun contenu disponible"
                        : item.name
                    }
                  >
                    {hasContent ? (
                      <img
                        src={item.content}
                        alt={item.name}
                        className={styles.filePickerThumb}
                      />
                    ) : (
                      <Icon
                        name={item.type === "folder" ? "folder" : "file"}
                        size={28}
                        color={item.type === "folder" ? "#d85E33" : undefined}
                      />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              })}
              {getChildren(filePickerPath).length === 0 && (
                <div className={styles.filePickerEmpty}>Dossier vide</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Preview modal */}
      {reportPreview && (
        <div
          className={styles.reportPreviewOverlay}
          onClick={() => {
            setReportPreview(null);
            setSendStep(null);
          }}
        >
          <div
            className={styles.reportPreviewModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.reportPreviewHeader}>
              <span className={styles.reportPreviewTitle}>
                <Icon name="file" size={13} />
                {sendStep === "selectRecipient"
                  ? "Sélectionner un destinataire"
                  : reportPreview.filename}
              </span>
              <div className={styles.reportPreviewActions}>
                {sendStep === "selectRecipient" ? (
                  <button
                    className={styles.reportSaveBtn}
                    onClick={() => setSendStep(null)}
                  >
                    Retour
                  </button>
                ) : (
                  <button
                    className={styles.reportSaveBtn}
                    onClick={handleSendReport}
                  >
                    <Icon name="mail" size={12} />
                    Envoyer le rapport
                  </button>
                )}
                <button
                  className={styles.reportCloseBtn}
                  onClick={() => {
                    setReportPreview(null);
                    setSendStep(null);
                  }}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            </div>
            {sendStep === "selectRecipient" ? (
              <div className={styles.recipientList}>
                <p className={styles.recipientHint}>
                  À qui souhaitez-vous envoyer ce rapport ?
                </p>
                {recipients.map((r) => (
                  <button
                    key={r.from}
                    className={styles.recipientItem}
                    onClick={() => handleSelectRecipient(r)}
                  >
                    <div className={styles.recipientAvatar}>{r.avatar}</div>
                    <div className={styles.recipientInfo}>
                      <span className={styles.recipientName}>{r.from}</span>
                      <span className={styles.recipientRole}>{r.role}</span>
                    </div>
                    <Icon name="chevron-right" size={14} />
                  </button>
                ))}
              </div>
            ) : (
              <iframe
                className={styles.reportPreviewFrame}
                srcDoc={reportPreview.html}
                title="Aperçu du rapport"
                sandbox="allow-same-origin"
              />
            )}
          </div>
        </div>
      )}

      {/* Loading overlay for the whole app */}
      {(faceModelStatus === "idle" ||
        faceModelStatus === "loading" ||
        faceCheckLoading) && (
        <div className={styles.globalLoadingOverlay}>
          <div className={styles.scannerLine}></div>
          <div className={styles.loadingContent}>
            <div className={styles.loadingIconWrap}>
              <Icon name="settings" size={48} color="#d85E33" />
            </div>
            <h2 className={styles.loadingTitle}>
              {faceCheckLoading ? "Analyse en cours" : "Initialisation"}
            </h2>
            <p className={styles.loadingText}>
              {faceCheckLoading
                ? "Vérification des correspondances biométriques..."
                : "Chargement du module d'intelligence artificielle..."}
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <div className={styles.loadingLogs}>
              <span>{">"} model_weights: OK</span>
              <span>{">"} face_api: OK</span>
              <span className={styles.blinkCursor}>_</span>
            </div>
          </div>
        </div>
      )}

      {popupError && (
        <Popup
          title="Mauvais destinataire"
          message={popupError}
          type="error"
          onClose={() => setPopupError(null)}
        />
      )}
    </div>
  );
}
