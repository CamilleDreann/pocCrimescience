import { useState } from 'react'
import Icon from '../../components/ui/Icon'
import styles from './TextEditor.module.css'

const defaultTabs = [
  { id: 'untitled', name: 'Untitled', content: '' },
]

export default function TextEditor() {
  const [tabs, setTabs] = useState(defaultTabs)
  const [activeTab, setActiveTab] = useState('untitled')
  const [tabCounter, setTabCounter] = useState(1)

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  const handleContentChange = (value) => {
    setTabs(prev =>
      prev.map(t => t.id === activeTab ? { ...t, content: value } : t)
    )
  }

  const addTab = () => {
    const id = `tab-${tabCounter}`
    const newTab = { id, name: `Untitled ${tabCounter}`, content: '' }
    setTabs(prev => [...prev, newTab])
    setActiveTab(id)
    setTabCounter(prev => prev + 1)
  }

  const closeTab = (id) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    }
  }

  return (
    <div className={styles.editor}>
      <div className={styles.tabBar}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabName}>{tab.name}</span>
            <button
              className={styles.tabClose}
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
            >
              <Icon name="close" size={10} />
            </button>
          </div>
        ))}
        <button className={styles.addTab} onClick={addTab}>
          <Icon name="plus" size={14} />
        </button>
      </div>
      <div className={styles.editorArea}>
        <div className={styles.lineNumbers}>
          {(currentTab.content || '\n').split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          className={styles.textarea}
          value={currentTab.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>
      <div className={styles.statusBar}>
        <span>Ln {(currentTab.content || '').split('\n').length}, Col 1</span>
        <span>UTF-8</span>
        <span>Plain Text</span>
      </div>
    </div>
  )
}
