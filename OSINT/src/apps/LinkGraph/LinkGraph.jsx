import { useState, useRef, useCallback, useEffect } from 'react'
import { useOS } from '../../context/useOS'
import Icon from '../../components/ui/Icon'
import styles from './LinkGraph.module.css'

const PLATFORM_THEMES = {
  Instagram: { color: '#E1306C', bg: '#2a0f18' },
  LinkedIn: { color: '#0A66C2', bg: '#0a1a2e' },
  Twitter: { color: '#9CA0A5', bg: '#151618' },
  Facebook: { color: '#1877F2', bg: '#0b1a30' },
  GitHub: { color: '#8B5CF6', bg: '#1a1030' },
  Discord: { color: '#5865F2', bg: '#141530' },
  TikTok: { color: '#00F2EA', bg: '#0a2020' },
  Snapchat: { color: '#FFFC00', bg: '#1e1e0a' },
}

const PLATFORM_ICONS = {
  Instagram: 'platform-instagram',
  LinkedIn: 'platform-linkedin',
  Twitter: 'platform-twitter',
  Facebook: 'platform-facebook',
  GitHub: 'platform-github',
  Discord: 'platform-discord',
  TikTok: 'platform-tiktok',
  Snapchat: 'platform-snapchat',
}

const NODE_W = 160
const NODE_H = 40
const PERSON_W = 180
const PERSON_H = 48

let idCounter = 0
const uid = () => `n${++idCounter}`

function buildGraphData(apiData, existing) {
  const nodes = [...existing.nodes]
  const edges = [...existing.edges]

  // Check if person already exists
  const existingPerson = nodes.find(
    (n) => n.type === 'person' && n.data.email === apiData.email
  )
  if (existingPerson) return existing

  // Find a good position for the new person node
  const personNodes = nodes.filter((n) => n.type === 'person')
  const offsetX = personNodes.length * 320
  const centerX = 400 + offsetX
  const centerY = 300

  const personId = uid()
  nodes.push({
    id: personId,
    type: 'person',
    x: centerX,
    y: centerY,
    data: { name: apiData.name, email: apiData.email, platformCount: apiData.platforms.length },
  })

  const count = apiData.platforms.length
  apiData.platforms.forEach((p, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    const rx = 200 + Math.random() * 40
    const ry = 150 + Math.random() * 30
    const platId = uid()

    nodes.push({
      id: platId,
      type: 'platform',
      x: centerX + Math.cos(angle) * rx,
      y: centerY + Math.sin(angle) * ry,
      data: {
        platform: p.name,
        username: p.username,
        bio: p.bio,
        url: p.url,
        found: p.found,
      },
    })

    edges.push({ id: `e${personId}-${platId}`, from: personId, to: platId })
  })

  return { nodes, edges }
}

// Simple force simulation
function runForceStep(nodes, edges, iterations = 60) {
  const pos = nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }))
  const posMap = Object.fromEntries(pos.map((p) => [p.id, p]))

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations

    // Repulsion between all nodes
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i]
        const b = pos[j]
        let dx = b.x - a.x
        let dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (800 / (dist * dist)) * alpha
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.x -= fx
        a.y -= fy
        b.x += fx
        b.y += fy
      }
    }

    // Attraction along edges
    for (const e of edges) {
      const a = posMap[e.from]
      const b = posMap[e.to]
      if (!a || !b) continue
      let dx = b.x - a.x
      let dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const idealDist = 180
      const force = ((dist - idealDist) * 0.01) * alpha
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.x += fx
      a.y += fy
      b.x -= fx
      b.y -= fy
    }
  }

  return nodes.map((n) => {
    const p = posMap[n.id]
    return { ...n, x: p.x, y: p.y }
  })
}

export default function LinkGraph() {
  const { graphData, clearGraph, openApp } = useOS()
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [selectedNode, setSelectedNode] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const svgRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 })
  const prevGraphDataLen = useRef(0)

  // Rebuild graph when graphData changes
  useEffect(() => {
    if (graphData.length === 0) {
      setGraph({ nodes: [], edges: [] })
      setSelectedNode(null)
      prevGraphDataLen.current = 0
      idCounter = 0
      return
    }
    if (graphData.length !== prevGraphDataLen.current) {
      idCounter = 0
      let current = { nodes: [], edges: [] }
      for (const entry of graphData) {
        current = buildGraphData(entry, current)
      }
      const layouted = runForceStep(current.nodes, current.edges)
      setGraph({ nodes: layouted, edges: current.edges })
      prevGraphDataLen.current = graphData.length
    }
  }, [graphData])

  // Node drag handlers
  const onNodeMouseDown = useCallback(
    (e, node) => {
      e.stopPropagation()
      setDragging(node.id)
      setSelectedNode(node)
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        nodeX: node.x,
        nodeY: node.y,
      }
    },
    []
  )

  // Canvas pan handlers
  const onCanvasMouseDown = useCallback(
    (e) => {
      if (e.target === svgRef.current || e.target.tagName === 'rect') {
        setIsPanning(true)
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          panX: pan.x,
          panY: pan.y,
        }
        setSelectedNode(null)
      }
    },
    [pan]
  )

  const onMouseMove = useCallback(
    (e) => {
      if (dragging) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        setGraph((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) =>
            n.id === dragging
              ? { ...n, x: dragStart.current.nodeX + dx, y: dragStart.current.nodeY + dy }
              : n
          ),
        }))
        // Update selected node position too
        setSelectedNode((prev) =>
          prev && prev.id === dragging
            ? { ...prev, x: dragStart.current.nodeX + dx, y: dragStart.current.nodeY + dy }
            : prev
        )
      } else if (isPanning) {
        const dx = e.clientX - panStart.current.x
        const dy = e.clientY - panStart.current.y
        setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy })
      }
    },
    [dragging, isPanning]
  )

  const onMouseUp = useCallback(() => {
    setDragging(null)
    setIsPanning(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const getNodeCenter = (node) => {
    const w = node.type === 'person' ? PERSON_W : NODE_W
    const h = node.type === 'person' ? PERSON_H : NODE_H
    return { cx: node.x + w / 2, cy: node.y + h / 2 }
  }

  const isEmpty = graph.nodes.length === 0

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
                {graph.nodes.filter((n) => n.type === 'person').length} cible{graph.nodes.filter((n) => n.type === 'person').length !== 1 ? 's' : ''}
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
                    <circle cx="14" cy="14" r="6" stroke="#e95420" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="34" cy="14" r="4" stroke="#5865F2" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="24" cy="36" r="5" stroke="#3fb950" strokeWidth="1.5" opacity="0.6" />
                    <line x1="19" y1="16" x2="30" y2="14" stroke="#444" strokeWidth="1" />
                    <line x1="16" y1="19" x2="22" y2="32" stroke="#444" strokeWidth="1" />
                    <line x1="32" y1="18" x2="26" y2="32" stroke="#444" strokeWidth="1" />
                  </svg>
                </div>
                <p className={styles.emptyTitle}>Graphe de liens</p>
                <p className={styles.emptyText}>
                  Lancez une recherche OSINT puis exportez les resultats ici
                </p>
                <button
                  className={styles.openSearchBtn}
                  onClick={() => openApp({ appId: 'osint-search', title: 'OSINT Search', icon: 'osint-search', defaultSize: { width: 820, height: 580 } })}
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
              style={{ cursor: isPanning ? 'grabbing' : dragging ? 'grabbing' : 'grab' }}
            >
              <defs>
                {/* Glow filters per platform */}
                {Object.entries(PLATFORM_THEMES).map(([name, theme]) => (
                  <filter key={name} id={`glow-${name}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={theme.color} floodOpacity="0.4" />
                  </filter>
                ))}
                <filter id="glow-person" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#e95420" floodOpacity="0.5" />
                </filter>
                {/* Grid pattern */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y})`}>
                {/* Background grid */}
                <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />

                {/* Edges */}
                {graph.edges.map((edge) => {
                  const fromNode = graph.nodes.find((n) => n.id === edge.from)
                  const toNode = graph.nodes.find((n) => n.id === edge.to)
                  if (!fromNode || !toNode) return null
                  const from = getNodeCenter(fromNode)
                  const to = getNodeCenter(toNode)
                  const platformName = toNode.type === 'platform' ? toNode.data.platform : fromNode.data?.platform
                  const theme = PLATFORM_THEMES[platformName] || { color: '#555' }

                  return (
                    <g key={edge.id}>
                      {/* Glow line */}
                      <line
                        x1={from.cx}
                        y1={from.cy}
                        x2={to.cx}
                        y2={to.cy}
                        stroke={theme.color}
                        strokeWidth="3"
                        opacity="0.15"
                      />
                      {/* Main line */}
                      <line
                        x1={from.cx}
                        y1={from.cy}
                        x2={to.cx}
                        y2={to.cy}
                        stroke={theme.color}
                        strokeWidth="1.5"
                        opacity="0.5"
                        strokeDasharray={
                          selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to)
                            ? 'none'
                            : '4 4'
                        }
                      />
                      {/* Connection dot at midpoint */}
                      <circle
                        cx={(from.cx + to.cx) / 2}
                        cy={(from.cy + to.cy) / 2}
                        r="2"
                        fill={theme.color}
                        opacity="0.4"
                      />
                    </g>
                  )
                })}

                {/* Nodes */}
                {graph.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id

                  if (node.type === 'person') {
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseDown={(e) => onNodeMouseDown(e, node)}
                        style={{ cursor: 'pointer' }}
                        className={styles.nodeGroup}
                      >
                        {/* Selection ring */}
                        {isSelected && (
                          <rect
                            x="-4"
                            y="-4"
                            width={PERSON_W + 8}
                            height={PERSON_H + 8}
                            rx="14"
                            fill="none"
                            stroke="#e95420"
                            strokeWidth="2"
                            opacity="0.6"
                            className={styles.selectionRing}
                          />
                        )}
                        <rect
                          width={PERSON_W}
                          height={PERSON_H}
                          rx="10"
                          fill="#1a1018"
                          stroke={isSelected ? '#e95420' : 'rgba(233,84,32,0.4)'}
                          strokeWidth={isSelected ? 2 : 1}
                          filter="url(#glow-person)"
                        />
                        {/* Avatar circle */}
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
                          fill="#e95420"
                          fontSize="12"
                          fontWeight="700"
                          fontFamily="var(--font-sans)"
                        >
                          {node.data.name.split(' ').map((w) => w[0]).join('')}
                        </text>
                        {/* Name */}
                        <text
                          x="48"
                          y={PERSON_H / 2 - 5}
                          fill="#fff"
                          fontSize="13"
                          fontWeight="600"
                          fontFamily="var(--font-sans)"
                        >
                          {node.data.name}
                        </text>
                        {/* Email */}
                        <text
                          x="48"
                          y={PERSON_H / 2 + 10}
                          fill="#888"
                          fontSize="10"
                          fontFamily="var(--font-mono)"
                        >
                          {node.data.email.length > 22
                            ? node.data.email.slice(0, 22) + '...'
                            : node.data.email}
                        </text>
                      </g>
                    )
                  }

                  // Platform node
                  const theme = PLATFORM_THEMES[node.data.platform] || { color: '#888', bg: '#1a1a1a' }
                  const iconName = PLATFORM_ICONS[node.data.platform] || 'search'

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={(e) => onNodeMouseDown(e, node)}
                      style={{ cursor: 'pointer' }}
                      className={styles.nodeGroup}
                    >
                      {isSelected && (
                        <rect
                          x="-4"
                          y="-4"
                          width={NODE_W + 8}
                          height={NODE_H + 8}
                          rx="12"
                          fill="none"
                          stroke={theme.color}
                          strokeWidth="2"
                          opacity="0.6"
                          className={styles.selectionRing}
                        />
                      )}
                      <rect
                        width={NODE_W}
                        height={NODE_H}
                        rx="8"
                        fill={theme.bg}
                        stroke={isSelected ? theme.color : `${theme.color}55`}
                        strokeWidth={isSelected ? 1.5 : 1}
                        filter={`url(#glow-${node.data.platform})`}
                      />
                      {/* Icon bg */}
                      <rect
                        x="4"
                        y="4"
                        width="32"
                        height="32"
                        rx="7"
                        fill={`${theme.color}22`}
                      />
                      {/* Platform icon via foreignObject */}
                      <foreignObject x="8" y="8" width="24" height="24">
                        <div
                          xmlns="http://www.w3.org/1999/xhtml"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                        >
                          <Icon name={iconName} size={16} color={theme.color} />
                        </div>
                      </foreignObject>
                      {/* Platform name */}
                      <text
                        x="42"
                        y={NODE_H / 2 - 4}
                        fill="#fff"
                        fontSize="12"
                        fontWeight="600"
                        fontFamily="var(--font-sans)"
                      >
                        {node.data.platform}
                      </text>
                      {/* Username */}
                      <text
                        x="42"
                        y={NODE_H / 2 + 10}
                        fill={theme.color}
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        opacity="0.8"
                      >
                        {node.data.username.length > 16
                          ? node.data.username.slice(0, 16) + '...'
                          : node.data.username}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Detail sidebar */}
        {selectedNode && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Details</span>
              <button
                className={styles.sidebarClose}
                onClick={() => setSelectedNode(null)}
              >
                <Icon name="close" size={14} />
              </button>
            </div>

            {selectedNode.type === 'person' ? (
              <div className={styles.sidebarBody}>
                <div className={styles.detailAvatar}>
                  <span className={styles.detailAvatarText}>
                    {selectedNode.data.name.split(' ').map((w) => w[0]).join('')}
                  </span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Nom</span>
                  <span className={styles.detailValue}>{selectedNode.data.name}</span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={`${styles.detailValue} ${styles.detailMono}`}>
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
            ) : (
              <div className={styles.sidebarBody}>
                <div
                  className={styles.detailPlatformBanner}
                  style={{
                    background: `linear-gradient(135deg, ${(PLATFORM_THEMES[selectedNode.data.platform] || { color: '#888' }).color}33, transparent)`,
                  }}
                >
                  <Icon
                    name={PLATFORM_ICONS[selectedNode.data.platform] || 'search'}
                    size={28}
                    color={(PLATFORM_THEMES[selectedNode.data.platform] || { color: '#888' }).color}
                  />
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Plateforme</span>
                  <span className={styles.detailValue}>{selectedNode.data.platform}</span>
                </div>
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Identifiant</span>
                  <span
                    className={`${styles.detailValue} ${styles.detailMono}`}
                    style={{
                      color: (PLATFORM_THEMES[selectedNode.data.platform] || { color: '#888' }).color,
                    }}
                  >
                    {selectedNode.data.username}
                  </span>
                </div>
                {selectedNode.data.bio && (
                  <div className={styles.detailSection}>
                    <span className={styles.detailLabel}>Bio</span>
                    <span className={styles.detailValue}>{selectedNode.data.bio}</span>
                  </div>
                )}
                {selectedNode.data.url && (
                  <div className={styles.detailSection}>
                    <span className={styles.detailLabel}>URL</span>
                    <span className={`${styles.detailValue} ${styles.detailMono} ${styles.detailUrl}`}>
                      {selectedNode.data.url}
                    </span>
                  </div>
                )}
                <div className={styles.detailDivider} />
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Statut</span>
                  <span className={`${styles.detailBadge} ${styles.badgeSuccess}`}>
                    Trouve
                  </span>
                </div>
                {selectedNode.data.platform === 'Instagram' && (
                  <button
                    className={styles.viewProfileBtn}
                    onClick={() => {
                      openApp({
                        appId: 'instagram-viewer',
                        title: `Instagram — ${selectedNode.data.username}`,
                        icon: 'platform-instagram',
                        defaultSize: { width: 420, height: 650 },
                        props: { username: selectedNode.data.username },
                        multiInstance: true,
                      })
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
