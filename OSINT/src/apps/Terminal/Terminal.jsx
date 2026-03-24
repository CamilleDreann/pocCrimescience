import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Terminal.module.css'

const COMMANDS = {
  help: () => `Available commands: help, clear, echo, ls, pwd, whoami, date, uname, cat, neofetch`,
  clear: () => null,
  pwd: () => '/home/user',
  whoami: () => 'user',
  date: () => new Date().toString(),
  uname: () => 'Linux osint-desktop 6.5.0-generic x86_64 GNU/Linux',
  ls: () => 'Desktop  Documents  Downloads  Pictures  .bashrc  .config',
  neofetch: () => [
    '       _,met$$$$$gg.          user@osint-desktop',
    '    ,g$$$$$$$$$$$$$$$P.       -------------------',
    '  ,g$$P"     """Y$$.".        OS: Ubuntu 24.04 LTS',
    ' ,$$P\'              `$$$.     Kernel: 6.5.0-generic',
    '\',$$P       ,ggs.     `$$b:   Shell: bash 5.2.15',
    '`d$$\'     ,$P"\'   .    $$$    Terminal: osint-term',
    ' $$P      d$\'     ,    $$P    CPU: Intel i7-12700H',
    ' $$:      $$.   -    ,d$$\'    Memory: 4096MB / 16384MB',
    ' $$;      Y$b._   _,d$P\'',
    ' Y$$.    `.`"Y$$$$P"\'',
    ' `$$b      "-.__',
    '  `Y$$',
    '   `Y$$.            ',
    '     `$$b.',
    '       `Y$$b.',
    '          `"Y$b._',
  ].join('\n'),
}

export default function Terminal() {
  const [lines, setLines] = useState([
    { type: 'output', text: 'Welcome to OSINT Terminal v1.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    const newLines = [
      ...lines,
      { type: 'input', text: `user@osint-desktop:~$ ${trimmed}` },
    ]

    setHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    if (command === 'clear') {
      setLines([])
      setInput('')
      return
    }

    if (command === 'echo') {
      newLines.push({ type: 'output', text: args.join(' ') })
    } else if (command === 'cat') {
      if (args.length === 0) {
        newLines.push({ type: 'error', text: 'cat: missing file operand' })
      } else {
        newLines.push({ type: 'output', text: `cat: ${args[0]}: This is simulated content of ${args[0]}` })
      }
    } else if (COMMANDS[command]) {
      const result = COMMANDS[command](args)
      if (result) {
        newLines.push({ type: 'output', text: result })
      }
    } else {
      newLines.push({ type: 'error', text: `bash: ${command}: command not found` })
    }

    setLines(newLines)
    setInput('')
  }, [lines])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    }
  }

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      <div className={styles.output}>
        {lines.map((line, i) => (
          <div key={i} className={`${styles.line} ${styles[line.type]}`}>
            {line.text}
          </div>
        ))}
        <div className={styles.inputLine}>
          <span className={styles.prompt}>user@osint-desktop:~$ </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
