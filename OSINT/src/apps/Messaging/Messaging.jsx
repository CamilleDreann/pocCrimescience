import { useMemo, useState } from 'react'
import { useStore } from '@nanostores/react'
import Icon from '../../components/ui/Icon'
import { $messages, markAsRead } from '../../stores/messagesStore'
import styles from './Messaging.module.css'

export default function Messaging() {
  const allMessages = useStore($messages)
  const [selectedId, setSelectedId] = useState(null)

  const messages = useMemo(() => {
    return allMessages
      .filter(m => m.render)
      .map(m => ({ ...m, date: new Date(m.date) }))
      .sort((a, b) => b.date - a.date)
  }, [allMessages])

  const selectedMessage = messages.find(m => m.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    markAsRead(id)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const unreadCount = messages.filter(m => !m.readed).length

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Icon name="mail" size={16} />
          <span>Boîte de réception</span>
          <span className={styles.count}>{unreadCount}</span>
        </div>
        <div className={styles.messageList}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageItem} ${selectedId === msg.id ? styles.selected : ''} ${!msg.readed ? styles.unread : ''}`}
              onClick={() => handleSelect(msg.id)}
            >
              <div className={styles.avatar}>{msg.avatar}</div>
              <div className={styles.messagePreview}>
                <div className={styles.messageFrom}>{msg.from}</div>
                <div className={styles.messageSubject}>{msg.subject}</div>
                <div className={styles.messageSnippet}>{msg.body.split('\n')[0]}</div>
              </div>
              <div className={styles.messageTime}>{formatTime(msg.date)}</div>
              {!msg.readed && <div className={styles.unreadDot} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reader}>
        {selectedMessage ? (
          <>
            <div className={styles.readerHeader}>
              <h2 className={styles.readerSubject}>{selectedMessage.subject}</h2>
              <div className={styles.readerMeta}>
                <div className={styles.readerAvatar}>{selectedMessage.avatar}</div>
                <div>
                  <div className={styles.readerFrom}>{selectedMessage.from}</div>
                  <div className={styles.readerRole}>{selectedMessage.role}</div>
                </div>
                <div className={styles.readerDate}>{formatTime(selectedMessage.date)}</div>
              </div>
            </div>
            <div className={styles.readerBody}>
              {selectedMessage.body}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <Icon name="mail" size={48} />
            <p>Sélectionnez un message pour le lire</p>
          </div>
        )}
      </div>
    </div>
  )
}
