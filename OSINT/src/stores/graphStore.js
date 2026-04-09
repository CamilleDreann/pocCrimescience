import { atom } from 'nanostores'

export const $graph = atom({ nodes: [], edges: [] })

let idCounter = 0
const uid = () => `n${++idCounter}`

function buildFromApiEntry(apiData, current) {
  const nodes = [...current.nodes]
  const edges = [...current.edges]

  const alreadyExists = nodes.find(
    (n) => n.type === 'person' && n.data.email === apiData.email
  )
  if (alreadyExists) return current

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
    data: {
      name: apiData.name,
      email: apiData.email,
      platformCount: apiData.platforms.length,
    },
  })

  // Reorder platforms so Instagram lands at the bottom of the circle (index ≈ count/2 → angle ≈ π/2)
  const platforms = [...apiData.platforms]
  const instaIdx = platforms.findIndex((p) => p.name === 'Instagram')
  if (instaIdx !== -1) {
    const [insta] = platforms.splice(instaIdx, 1)
    platforms.splice(Math.floor(platforms.length / 2), 0, insta)
  }

  const count = platforms.length
  platforms.forEach((p, i) => {
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
        posts: p.posts,
        followers: p.followers,
        following: p.following,
        postsCount: p.postsCount,
        activities: p.activities,
        totalActivities: p.totalActivities,
        totalKm: p.totalKm,
        tweets: p.tweets,
        tweetsCount: p.tweetsCount,
        company: p.company,
        title: p.title,
        connections: p.connections,
      },
    })
    edges.push({ id: `e${personId}-${platId}`, from: personId, to: platId })
  })

  return { nodes, edges }
}

function runForceStep(nodes, edges, iterations = 60) {
  const pos = nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }))
  const posMap = Object.fromEntries(pos.map((p) => [p.id, p]))

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations
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

// Rebuilt from scratch each time so idCounter resets cleanly
let apiEntries = []

export function addApiEntry(apiData) {
  const alreadyTracked = apiEntries.find((e) => e.email === apiData.email)
  if (alreadyTracked) return

  apiEntries = [...apiEntries, apiData]
  idCounter = 0

  // Preserve custom nodes across rebuild
  const prevCustom = $graph.get().nodes.filter((n) => n.type === 'custom')
  const prevCustomEdges = $graph.get().edges.filter((e) =>
    prevCustom.some((n) => n.id === e.from || n.id === e.to)
  )

  let current = { nodes: [], edges: [] }
  for (const entry of apiEntries) {
    current = buildFromApiEntry(entry, current)
  }

  const layouted = runForceStep(current.nodes, current.edges)
  $graph.set({
    nodes: [...layouted, ...prevCustom],
    edges: [...current.edges, ...prevCustomEdges],
  })
}

export function addCustomNode(node, edge) {
  const prev = $graph.get()
  $graph.set({
    nodes: [...prev.nodes, node],
    edges: edge ? [...prev.edges, edge] : prev.edges,
  })
}

export function clearGraph() {
  apiEntries = []
  idCounter = 0
  $graph.set({ nodes: [], edges: [] })
}

export function updateNode(nodeId, data) {
  const prev = $graph.get()
  $graph.set({
    ...prev,
    nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
  })
}

export function removeNode(nodeId) {
  const prev = $graph.get()
  // Also remove from apiEntries if it's a person node
  const node = prev.nodes.find((n) => n.id === nodeId)
  if (node?.type === 'person') {
    apiEntries = apiEntries.filter((e) => e.email !== node.data.email)
  }
  $graph.set({
    nodes: prev.nodes.filter((n) => n.id !== nodeId),
    edges: prev.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
  })
}

export function updateNodePosition(nodeId, x, y) {
  const prev = $graph.get()
  $graph.set({
    ...prev,
    nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
  })
}

export { uid }
