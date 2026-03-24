import { useState } from 'react'
import Icon from '../../components/ui/Icon'
import styles from './Messaging.module.css'

const initialMessages = [
  {
    id: 'welcome-1',
    from: 'Marie Dupont',
    role: 'Secrétaire de direction',
    avatar: 'MD',
    subject: 'Bienvenue dans l\'équipe !',
    date: new Date(Date.now() - 1000 * 60 * 2),
    read: false,
    body: `Bonjour et bienvenue !\n\nJe suis Marie Dupont, secrétaire de direction du service. Je tenais à vous souhaiter personnellement un chaleureux accueil parmi nous.\n\nVotre poste de travail a été configuré avec tous les outils nécessaires à vos missions. Vous trouverez notamment l'application OSINT Search qui sera votre outil principal pour les investigations.\n\nN'hésitez pas à me contacter si vous avez la moindre question ou besoin d'assistance. Je suis disponible au bureau 204, 2ème étage.\n\nEncore bienvenue et bonne installation !\n\nCordialement,\nMarie Dupont\nSecrétaire de direction`,
  },
]

export default function Messaging() {
  const [messages] = useState(initialMessages)
  const [selectedId, setSelectedId] = useState(null)
  const [readMessages, setReadMessages] = useState(new Set())

  const selectedMessage = messages.find(m => m.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    setReadMessages(prev => new Set([...prev, id]))
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Icon name="mail" size={16} />
          <span>Boîte de réception</span>
          <span className={styles.count}>{messages.filter(m => !readMessages.has(m.id) && !m.read).length}</span>
        </div>
        <div className={styles.messageList}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.messageItem} ${selectedId === msg.id ? styles.selected : ''} ${!readMessages.has(msg.id) && !msg.read ? styles.unread : ''}`}
              onClick={() => handleSelect(msg.id)}
            >
              <div className={styles.avatar}>{msg.avatar}</div>
              <div className={styles.messagePreview}>
                <div className={styles.messageFrom}>{msg.from}</div>
                <div className={styles.messageSubject}>{msg.subject}</div>
                <div className={styles.messageSnippet}>{msg.body.split('\n')[0]}</div>
              </div>
              <div className={styles.messageTime}>{formatTime(msg.date)}</div>
              {!readMessages.has(msg.id) && !msg.read && <div className={styles.unreadDot} />}
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
