const fs = {
  '/': { type: 'folder', name: '/' },
  '/home': { type: 'folder', name: 'home' },
  '/home/Documents': { type: 'folder', name: 'Documents' },
  '/home/Documents/report.pdf': { type: 'file', name: 'report.pdf', size: '2.4 MB', modified: '2026-03-15' },
  '/home/Documents/notes.txt': { type: 'file', name: 'notes.txt', size: '1.2 KB', modified: '2026-03-18' },
  '/home/Documents/project': { type: 'folder', name: 'project' },
  '/home/Documents/project/index.html': { type: 'file', name: 'index.html', size: '4.1 KB', modified: '2026-03-10' },
  '/home/Documents/project/style.css': { type: 'file', name: 'style.css', size: '2.8 KB', modified: '2026-03-10' },
  '/home/Documents/Rapports': { type: 'folder', name: 'Rapports' },
  '/home/Downloads': { type: 'folder', name: 'Downloads' },
  '/home/Downloads/image.png': { type: 'file', name: 'image.png', size: '512 KB', modified: '2026-03-19' },
  '/home/Downloads/archive.zip': { type: 'file', name: 'archive.zip', size: '15.3 MB', modified: '2026-03-17' },
  '/home/Downloads/setup.deb': { type: 'file', name: 'setup.deb', size: '48.2 MB', modified: '2026-03-12' },
  '/home/Pictures': { type: 'folder', name: 'Pictures' },
  '/home/Pictures/wallpaper.jpg': { type: 'file', name: 'wallpaper.jpg', size: '3.8 MB', modified: '2026-02-28' },
  '/home/Pictures/screenshot.png': { type: 'file', name: 'screenshot.png', size: '1.1 MB', modified: '2026-03-20' },
  '/home/Desktop': { type: 'folder', name: 'Desktop' },
  '/home/.config': { type: 'folder', name: '.config' },
  '/home/.bashrc': { type: 'file', name: '.bashrc', size: '3.5 KB', modified: '2026-01-15' },
}

export const fileSystem = fs

export function addFile(path, fileData) {
  fs[path] = fileData
}

export function clearScreenshots() {
  for (const path in fs) {
    if (path.startsWith('/home/Pictures/screenshot-')) {
      delete fs[path]
    }
  }
}

export function getNode(path) {
  return fs[path] || null
}

export function getChildren(parentPath) {
  const prefix = parentPath === '/' ? '/' : parentPath + '/'
  const children = []
  for (const path in fs) {
    if (path === parentPath) continue
    if (!path.startsWith(prefix)) continue
    // Direct children only
    const rest = path.slice(prefix.length)
    if (rest.includes('/')) continue
    children.push({ ...fs[path], path })
  }
  // Folders first, then files
  children.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'folder' ? -1 : 1
  })
  return children
}
