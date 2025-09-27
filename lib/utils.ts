import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to strip BBCode formatting from text for plain text usage (e.g., metadata)
export function stripBBCode(text: string): string {
  if (!text) return text

  let stripped = text

  // Handle tables first (complex structure)
  stripped = stripped.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, (match: string, content: string) => {
    // For plain text, just extract the content without table markup
    let tableContent = content
    tableContent = tableContent.replace(/\[tr\]([\s\S]*?)\[\/tr\]/gi, (trMatch: string, trContent: string) => {
      let rowContent = trContent
      rowContent = rowContent.replace(/\[th\]([\s\S]*?)\[\/th\]/gi, '$1 | ')
      rowContent = rowContent.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, '$1 | ')
      return rowContent.trim() + '\n'
    })
    return tableContent
  })

  // Handle lists
  stripped = stripped.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (match: string, content: string) => {
    let listContent = content
    listContent = listContent.replace(/\[\*\](.*?)(?=\[\*\]|$)/gi, '• $1\n')
    return listContent
  })

  // Handle headers
  stripped = stripped.replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, '$1\n')
  stripped = stripped.replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, '$1\n')
  stripped = stripped.replace(/\[h3\]([\s\S]*?)\[\/h3\]/gi, '$1\n')

  // Handle horizontal rules
  stripped = stripped.replace(/\[hr\]/gi, '---\n')

  // Handle URLs
  stripped = stripped.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, '$2 ($1)')
  stripped = stripped.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1')

  // Handle basic formatting (just remove tags)
  stripped = stripped.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '$1')
  stripped = stripped.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '$1')
  stripped = stripped.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '$1')
  stripped = stripped.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '$1')

  // Handle colors (remove color info)
  stripped = stripped.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, '$2')

  // Handle code
  stripped = stripped.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, '$1')

  // Remove any remaining BBCode tags (fallback)
  stripped = stripped.replace(/\[.*?\]/g, '')

  // Clean up extra whitespace
  stripped = stripped.replace(/\n\s*\n/g, '\n').trim()

  return stripped
}
