import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Network, RefreshCw, ZoomIn, ZoomOut, Maximize2, Filter, Search, Info, X } from 'lucide-react'
import { graphAPI } from '../services/api'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'

const NODE_COLORS = {
  file: '#6366f1',
  controller: '#ef4444',
  service: '#10b981',
  middleware: '#f59e0b',
  route: '#8b5cf6',
  hook: '#06b6d4',
  component: '#ec4899',
}

const NODE_LABELS = {
  file: 'File',
  controller: 'Controller',
  service: 'Service',
  middleware: 'Middleware',
  route: 'Route',
  hook: 'Hook',
  component: 'Component',
}

export default function CodeGraph() {
  const [graph, setGraph] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeDetails, setNodeDetails] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef(null)
  const fgRef = useRef(null)

  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true)
      const response = await graphAPI.getGraph()
      setGraph(response.data.graph)
      setStats(response.data.stats)
    } catch (error) {
      toast.error('Failed to load graph data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGraph()
  }, [fetchGraph])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 600,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const filteredGraph = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] }

    let nodes = graph.nodes
    let edges = graph.edges

    if (filterType !== 'all') {
      nodes = nodes.filter((n) => n.type === filterType)
      const nodeIds = new Set(nodes.map((n) => n.id))
      edges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      nodes = nodes.filter(
        (n) => n.label.toLowerCase().includes(query) || n.path.toLowerCase().includes(query)
      )
      const nodeIds = new Set(nodes.map((n) => n.id))
      edges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    }

    return { nodes, edges }
  }, [graph, filterType, searchQuery])

  const graphData = useMemo(() => {
    return {
      nodes: filteredGraph.nodes.map((n) => ({
        ...n,
        color: NODE_COLORS[n.type] || NODE_COLORS.file,
        size: n.type === 'file' ? 8 : 12,
      })),
      links: filteredGraph.edges.map((e) => ({
        source: e.source,
        target: e.target,
        color: '#4a5568',
      })),
    }
  }, [filteredGraph])

  const handleNodeClick = useCallback(async (node) => {
    setSelectedNode(node)
    try {
      const response = await graphAPI.getNodeDetails(node.id)
      setNodeDetails(response.data)
    } catch (error) {
      toast.error('Failed to load node details')
    }
  }, [])

  const handleZoomIn = () => {
    if (fgRef.current) {
      fgRef.current.zoom(1.2)
    }
  }

  const handleZoomOut = () => {
    if (fgRef.current) {
      fgRef.current.zoom(0.8)
    }
  }

  const handleResetView = () => {
    if (fgRef.current) {
      fgRef.current.zoom(1)
      fgRef.current.centerAt(0, 0)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-dark-400">Loading code graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Network className="w-7 h-7 text-primary-500" />
            Code Dependency Graph
          </h1>
          <p className="text-dark-400 mt-1">
            Visualize API relationships and code dependencies
          </p>
        </div>
        <Button onClick={fetchGraph} variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-dark-400 text-sm">Total Files</p>
            <p className="text-2xl font-bold text-white">{stats.totalNodes}</p>
          </Card>
          <Card className="p-4">
            <p className="text-dark-400 text-sm">Connections</p>
            <p className="text-2xl font-bold text-white">{stats.totalEdges}</p>
          </Card>
          <Card className="p-4">
            <p className="text-dark-400 text-sm">Controllers</p>
            <p className="text-2xl font-bold text-red-400">{stats.nodeTypes?.controller || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-dark-400 text-sm">Services</p>
            <p className="text-2xl font-bold text-green-400">{stats.nodeTypes?.service || 0}</p>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Types</option>
              {Object.entries(NODE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button onClick={handleZoomIn} variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button onClick={handleZoomOut} variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button onClick={handleResetView} variant="ghost" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div ref={containerRef} className="relative bg-dark-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          {graphData.nodes.length > 0 ? (
            <div
              id="graph-container"
              style={{ width: '100%', height: '100%' }}
            >
              <ForceGraph
                graphData={graphData}
                width={dimensions.width}
                height={500}
                ref={fgRef}
                nodeColor={(node) => node.color}
                nodeLabel={(node) => `${node.label}\n${node.path}`}
                nodeRelSize={8}
                linkColor={() => '#4a5568'}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                onNodeClick={handleNodeClick}
                d3VelocityDecay={0.3}
                warmupTicks={100}
                cooldownTicks={100}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-dark-400">No nodes match your filter</p>
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-dark-800/90 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-dark-400 mb-2">Node Types</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-dark-300">{NODE_LABELS[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {selectedNode && nodeDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 w-96 max-h-[70vh] overflow-auto bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-50"
        >
          <div className="p-4 border-b border-dark-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
              />
              <h3 className="font-semibold text-white">{selectedNode.label}</h3>
            </div>
            <button
              onClick={() => {
                setSelectedNode(null)
                setNodeDetails(null)
              }}
              className="text-dark-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs text-dark-400 mb-1">Path</p>
              <p className="text-sm text-white font-mono break-all">{selectedNode.path}</p>
            </div>

            <div>
              <p className="text-xs text-dark-400 mb-1">Type</p>
              <Badge style={{ backgroundColor: NODE_COLORS[selectedNode.type] + '20', color: NODE_COLORS[selectedNode.type] }}>
                {NODE_LABELS[selectedNode.type]}
              </Badge>
            </div>

            {selectedNode.endpoints?.length > 0 && (
              <div>
                <p className="text-xs text-dark-400 mb-2">API Endpoints</p>
                <div className="space-y-1">
                  {selectedNode.endpoints.map((ep, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Badge variant={ep.method === 'GET' ? 'success' : ep.method === 'POST' ? 'primary' : 'warning'} className="text-xs">
                        {ep.method}
                      </Badge>
                      <span className="text-dark-300 font-mono">{ep.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.exports?.length > 0 && (
              <div>
                <p className="text-xs text-dark-400 mb-2">Exports</p>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.exports.map((exp, i) => (
                    <Badge key={i} variant="default" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {nodeDetails.dependencies?.length > 0 && (
              <div>
                <p className="text-xs text-dark-400 mb-2">Depends On ({nodeDetails.dependencies.length})</p>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {nodeDetails.dependencies.map((dep, i) => (
                    <div key={i} className="text-sm text-dark-300 truncate">
                      {dep.target.split('/').pop()}
                      {dep.label && <span className="text-dark-500"> ({dep.label})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nodeDetails.dependents?.length > 0 && (
              <div>
                <p className="text-xs text-dark-400 mb-2">Used By ({nodeDetails.dependents.length})</p>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {nodeDetails.dependents.map((dep, i) => (
                    <div key={i} className="text-sm text-dark-300 truncate">
                      {dep.source.split('/').pop()}
                      {dep.label && <span className="text-dark-500"> ({dep.label})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

const ForceGraph = ({ graphData, width, height, ref, nodeColor, nodeLabel, nodeRelSize, linkColor, linkDirectionalArrowLength, linkDirectionalArrowRelPos, onNodeClick, d3VelocityDecay, warmupTicks, cooldownTicks }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !graphData.nodes.length) return

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')

    const nodes = graphData.nodes.map((n, i) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height / 2 + (Math.random() - 0.5) * height * 0.5,
      vx: 0,
      vy: 0,
    }))

    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    const links = graphData.links
      .filter((l) => nodeMap.has(typeof l.source === 'object' ? l.source.id : l.source) && nodeMap.has(typeof l.target === 'object' ? l.target.id : l.target))
      .map((l) => ({
        ...l,
        source: nodeMap.get(typeof l.source === 'object' ? l.source.id : l.source),
        target: nodeMap.get(typeof l.target === 'object' ? l.target.id : l.target),
      }))

    let animFrame
    let running = true

    const simulate = () => {
      for (const node of nodes) {
        node.vx *= 0.9
        node.vy *= 0.9
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 500 / (dist * dist)
          nodes[i].vx -= (dx / dist) * force
          nodes[i].vy -= (dy / dist) * force
          nodes[j].vx += (dx / dist) * force
          nodes[j].vy += (dy / dist) * force
        }
      }

      for (const link of links) {
        const dx = link.target.x - link.source.x
        const dy = link.target.y - link.source.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 100) * 0.01
        link.source.vx += (dx / dist) * force
        link.source.vy += (dy / dist) * force
        link.target.vx -= (dx / dist) * force
        link.target.vy -= (dy / dist) * force
      }

      const centerX = width / 2
      const centerY = height / 2
      for (const node of nodes) {
        node.vx += (centerX - node.x) * 0.001
        node.vy += (centerY - node.y) * 0.001
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(20, Math.min(width - 20, node.x))
        node.y = Math.max(20, Math.min(height - 20, node.y))
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = '#4a556840'
      ctx.lineWidth = 1
      for (const link of links) {
        ctx.beginPath()
        ctx.moveTo(link.source.x, link.source.y)
        ctx.lineTo(link.target.x, link.target.y)
        ctx.stroke()
      }

      for (const node of nodes) {
        ctx.fillStyle = node.color || '#6366f1'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size || 8, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + (node.size || 8) + 12)
      }
    }

    const tick = () => {
      if (!running) return
      simulate()
      render()
      animFrame = requestAnimationFrame(tick)
    }

    tick()

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      for (const node of nodes) {
        const dx = node.x - x
        const dy = node.y - y
        if (Math.sqrt(dx * dx + dy * dy) < (node.size || 8) + 5) {
          onNodeClick?.(node)
          break
        }
      }
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      running = false
      cancelAnimationFrame(animFrame)
      canvas.removeEventListener('click', handleClick)
    }
  }, [graphData, width, height, onNodeClick])

  return <div ref={containerRef} style={{ width, height }} />
}
