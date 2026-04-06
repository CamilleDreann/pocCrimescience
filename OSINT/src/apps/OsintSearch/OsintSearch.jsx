import { useState, useRef, useEffect } from 'react'
import { useOS } from '../../context/useOS'
import { $graph } from '../../stores/graphStore'
import { useClickOutside } from '../../hooks/useClickOutside'
import Icon from '../../components/ui/Icon'
import styles from './OsintSearch.module.css'

const PLATFORM_THEMES = {
  Instagram: { color: '#E1306C', gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
  LinkedIn: { color: '#0A66C2', gradient: 'linear-gradient(135deg, #0A66C2, #004182)' },
  Twitter: { color: '#000000', gradient: 'linear-gradient(135deg, #15202B, #000000)' },
  Facebook: { color: '#1877F2', gradient: 'linear-gradient(135deg, #1877F2, #0C5DC7)' },
  GitHub: { color: '#8B5CF6', gradient: 'linear-gradient(135deg, #6e40c9, #8B5CF6)' },
  Discord: { color: '#5865F2', gradient: 'linear-gradient(135deg, #5865F2, #404EED)' },
  TikTok: { color: '#00F2EA', gradient: 'linear-gradient(135deg, #00F2EA, #FF0050)' },
  Snapchat: { color: '#FFFC00', gradient: 'linear-gradient(135deg, #FFFC00, #FFE600)' },
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

export default function OsintSearch() {
  const { exportToGraph, openApp, addNotification } = useOS()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [allEmails, setAllEmails] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const searchAreaRef = useRef(null)

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setAllEmails(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      setResults(null)
      setError(null)
      setSearched(false)
      return
    }
    const q = query.toLowerCase()
    const filtered = allEmails
      .filter(email => email.toLowerCase().includes(q))
      .slice(0, 5)
    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [query, allEmails])

  useClickOutside(searchAreaRef, () => setShowSuggestions(false))

  const handleSelectSuggestion = (email) => {
    setQuery(email)
    setShowSuggestions(false)
    handleSearch(email)
  }

  const handleSearch = async (emailOverride) => {
    const email = (emailOverride ?? query).trim()
    if (!email) return

    setLoading(true)
    setError(null)
    setResults(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/search?email=${encodeURIComponent(email)}`)

      if (res.status === 404) {
        setError('Aucun resultat pour cet email.')
        return
      }

      if (!res.ok) {
        setError('Erreur lors de la recherche.')
        return
      }

      const data = await res.json()
      setResults(data)
    } catch {
      setError('Impossible de contacter le serveur. Verifiez que l\'API est lancee.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Icon name="osint-search" size={22} />
        </div>
        <div className={styles.headerText}>
          <h2 className={styles.title}>OSINT Lookup</h2>
          <p className={styles.subtitle}>Recherche de presence numerique par email</p>
        </div>
      </div>

      {/* Search bar */}
      <div className={styles.searchArea}>
        <div ref={searchAreaRef} style={{ position: 'relative' }}>
        <div className={styles.searchBar}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="email"
            className={styles.searchInput}
            placeholder="Entrez un email... (ex: marie.dupont@gmail.com)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Rechercher'
            )}
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsDropdown}>
            {suggestions.map(email => (
              <li
                key={email}
                className={styles.suggestionItem}
                onMouseDown={() => handleSelectSuggestion(email)}
              >
                {email}
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      {/* Results */}
      <div className={styles.resultsArea}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.scanLine} />
            <p className={styles.loadingText}>Analyse en cours...</p>
            <div className={styles.scanDots}>
              <span /><span /><span />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorState}>
            <Icon name="close" size={32} className={styles.errorIcon} />
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {results && !loading && (
          <div className={styles.resultsContainer}>
            <div className={styles.resultsMeta}>
              <span className={styles.resultsTarget}>{results.name}</span>
              <span className={styles.resultsEmail}>{results.email}</span>
              <span className={styles.resultsCount}>
                {results.platforms.length} plateforme{results.platforms.length > 1 ? 's' : ''} trouvee{results.platforms.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.platformGrid}>
              {results.platforms.map((p) => {
                const theme = PLATFORM_THEMES[p.name] || { color: '#888', gradient: 'none' }
                const iconName = PLATFORM_ICONS[p.name] || 'search'

                return (
                  <div
                    key={p.name}
                    className={styles.platformCard}
                    style={{ '--platform-color': theme.color, '--platform-gradient': theme.gradient }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <Icon name={iconName} size={20} />
                      </div>
                      <span className={styles.cardPlatform}>{p.name}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.cardUsername}>{p.username}</span>
                      {p.bio && <p className={styles.cardBio}>{p.bio}</p>}
                    </div>
                    {p.url && (
                      <div className={styles.cardFooter}>
                        <span className={styles.cardLink} title={p.url}>
                          {p.url}
                        </span>
                      </div>
                    )}
                    <div className={styles.cardGlow} />
                  </div>
                )
              })}
            </div>

          </div>
        )}

        {!searched && !loading && (
          <div className={styles.emptyState}>
            <Icon name="osint-search" size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Entrez un email pour lancer une recherche OSINT</p>
            <div className={styles.emailHints}>
              {['marie.dupont@gmail.com', 'julien.caron@gmail.com', 'lucas.martin@hotmail.com', 'thomas.leroy@proton.me'].map((email) => (
                <button
                  key={email}
                  className={styles.hintChip}
                  onClick={() => { setQuery(email); inputRef.current?.focus() }}
                >
                  {email}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {results && !loading && (
        <button
          className={styles.linkGraphCta}
          onClick={() => {
            const alreadyExported = $graph.get().nodes.some((n) => n.type === 'person' && n.data.email === results.email)
            if (alreadyExported) {
              addNotification({ title: 'OSINT Search', body: 'Deja exporte vers le graphe.', type: 'info' })
            } else {
              exportToGraph(results)
              addNotification({ title: 'OSINT Search', body: `${results.name} ajoute au graphe.`, type: 'success' })
            }
            openApp({ appId: 'link-graph', title: 'Link Graph', icon: 'link-graph', defaultSize: { width: 1000, height: 650 } })
          }}
        >
          <Icon name="link-graph" size={20} />
          <div className={styles.linkGraphCtaText}>
            <span className={styles.linkGraphCtaTitle}>Analyser dans LinkGraph</span>
            <span className={styles.linkGraphCtaDesc}>Visualise les connexions, détails de chaque plateforme, génère un rapport</span>
          </div>
          <span className={styles.linkGraphCtaArrow}>→</span>
        </button>
      )}
    </div>
  )
}
