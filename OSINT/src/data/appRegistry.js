import { lazy } from 'react'

const FileManager = lazy(() => import('../apps/FileManager/FileManager'))
const Terminal = lazy(() => import('../apps/Terminal/Terminal'))
const Settings = lazy(() => import('../apps/Settings/Settings'))
const TextEditor = lazy(() => import('../apps/TextEditor/TextEditor'))
const OsintSearch = lazy(() => import('../apps/OsintSearch/OsintSearch'))
const LinkGraph = lazy(() => import('../apps/LinkGraph/LinkGraph'))
const Messaging = lazy(() => import('../apps/Messaging/Messaging'))
const InstagramViewer = lazy(() => import('../apps/InstagramViewer/InstagramViewer'))

export const appRegistry = [
  {
    id: 'file-manager',
    title: 'Files',
    icon: 'folder',
    component: FileManager,
    defaultSize: { width: 850, height: 550 },
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    component: Terminal,
    defaultSize: { width: 700, height: 450 },
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    component: Settings,
    defaultSize: { width: 750, height: 500 },
  },
  {
    id: 'text-editor',
    title: 'Text Editor',
    icon: 'text-file',
    component: TextEditor,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: 'osint-search',
    title: 'OSINT Search',
    icon: 'osint-search',
    component: OsintSearch,
    defaultSize: { width: 820, height: 580 },
  },
  {
    id: 'link-graph',
    title: 'Link Graph',
    icon: 'link-graph',
    component: LinkGraph,
    defaultSize: { width: 1000, height: 650 },
  },
  {
    id: 'messaging',
    title: 'Messagerie',
    icon: 'mail',
    component: Messaging,
    defaultSize: { width: 900, height: 580 },
  },
  {
    id: 'instagram-viewer',
    title: 'Instagram',
    icon: 'platform-instagram',
    component: InstagramViewer,
    defaultSize: { width: 420, height: 650 },
  },
]
