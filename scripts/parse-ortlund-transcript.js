// Parse Gavin Ortlund's Revelation transcript from markdown to JSON
// Usage: node scripts/parse-ortlund-transcript.js <path-to-markdown-file>

import fs from 'fs'
import path from 'path'

const inputFile = process.argv[2]

if (!inputFile) {
  console.error('Usage: node parse-ortlund-transcript.js <path-to-markdown-file>')
  process.exit(1)
}

const content = fs.readFileSync(inputFile, 'utf-8')

// Split by section headers: # **Title (timestamp)**
const sectionRegex = /^# \*\*(.+?)\s*\((\d{2}:\d{2}:\d{2})\)\*\*/gm
const sections = []
let match

// Find all section headers
const headers = []
while ((match = sectionRegex.exec(content)) !== null) {
  headers.push({
    title: match[1].trim(),
    timestamp: match[2],
    startIndex: match.index,
    headerEnd: match.index + match[0].length
  })
}

// Extract text for each section
for (let i = 0; i < headers.length; i++) {
  const header = headers[i]
  const nextHeader = headers[i + 1]
  const textStart = header.headerEnd
  const textEnd = nextHeader ? nextHeader.startIndex : content.length
  const text = content.slice(textStart, textEnd).trim()
  
  sections.push({
    title: header.title,
    timestamp: header.timestamp,
    text: text
  })
}

// Categorize sections into introduction and commentaries
const introduction = []
const commentaries = []

// Patterns to identify introduction vs chapter sections
const introPatterns = [
  /^introduction$/i,
  /^\d+\)\s+/,  // Numbered points like "1) Revelation Is Worth..."
  /^book recommendation$/i
]

const chapterPattern = /^chapters?\s+(\d+)(?:[–\-](\d+))?$/i

let idCounter = 0

for (const section of sections) {
  const isIntro = introPatterns.some(pattern => pattern.test(section.title))
  
  if (isIntro) {
    introduction.push({
      id: `ortlund_${idCounter++}`,
      title: section.title,
      timestamp: section.timestamp,
      text: section.text
    })
  } else {
    const chapterMatch = section.title.match(chapterPattern)
    if (chapterMatch) {
      const startChapter = parseInt(chapterMatch[1])
      const endChapter = chapterMatch[2] ? parseInt(chapterMatch[2]) : startChapter
      
      if (startChapter === endChapter) {
        // Single chapter
        commentaries.push({
          id: `ortlund_${idCounter++}`,
          reference: `Chapter ${startChapter}`,
          timestamp: section.timestamp,
          chapter: startChapter,
          text: section.text,
          verses: null
        })
      } else {
        // Multi-chapter section - try to split by context or create entries for each
        const splitContent = tryToSplitByChapter(section.text, startChapter, endChapter)
        
        for (let ch = startChapter; ch <= endChapter; ch++) {
          commentaries.push({
            id: `ortlund_${idCounter++}`,
            reference: `Chapter ${ch}`,
            timestamp: section.timestamp,
            chapter: ch,
            text: splitContent[ch] || section.text,
            originalSection: `Chapters ${startChapter}–${endChapter}`,
            verses: null
          })
        }
      }
    } else {
      console.warn(`Unknown section type: ${section.title}`)
    }
  }
}

/**
 * Try to split multi-chapter content by looking for chapter references in the text
 */
function tryToSplitByChapter(text, startChapter, endChapter) {
  const result = {}
  const paragraphs = text.split(/\r?\n\r?\n+/)
  
  // For 2-chapter sections, try to find a natural split point
  const totalChapters = endChapter - startChapter + 1
  
  // Look for explicit chapter references to find split points
  const chapterSplitPoints = []
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]
    // Look for patterns like "chapter 5" or "chapters 5" or "Revelation 5"
    for (let ch = startChapter; ch <= endChapter; ch++) {
      const patterns = [
        new RegExp(`chapter\\s+${ch}\\b`, 'i'),
        new RegExp(`revelation\\s+${ch}\\b`, 'i'),
        new RegExp(`in\\s+${ch}:`, 'i')
      ]
      
      if (patterns.some(p => p.test(para))) {
        chapterSplitPoints.push({ chapter: ch, paragraphIndex: i })
        break
      }
    }
  }
  
  // If we found meaningful split points, use them
  if (chapterSplitPoints.length > 1) {
    // Sort by paragraph index
    chapterSplitPoints.sort((a, b) => a.paragraphIndex - b.paragraphIndex)
    
    // Build chapter content
    for (let i = 0; i < chapterSplitPoints.length; i++) {
      const current = chapterSplitPoints[i]
      const next = chapterSplitPoints[i + 1]
      const start = i === 0 ? 0 : current.paragraphIndex
      const end = next ? next.paragraphIndex : paragraphs.length
      
      result[current.chapter] = paragraphs.slice(start, end).join('\n\n')
    }
    
    // Fill in any missing chapters
    for (let ch = startChapter; ch <= endChapter; ch++) {
      if (!result[ch]) {
        // Find nearest content
        const nearestChapter = Object.keys(result).reduce((prev, curr) => 
          Math.abs(parseInt(curr) - ch) < Math.abs(parseInt(prev) - ch) ? curr : prev
        )
        result[ch] = result[nearestChapter]
      }
    }
    
    return result
  }
  
  // Fallback: divide paragraphs roughly equally
  if (paragraphs.length >= totalChapters) {
    for (let ch = startChapter; ch <= endChapter; ch++) {
      const chapterIndex = ch - startChapter
      const startIdx = Math.floor(chapterIndex * paragraphs.length / totalChapters)
      const endIdx = Math.floor((chapterIndex + 1) * paragraphs.length / totalChapters)
      result[ch] = paragraphs.slice(startIdx, endIdx).join('\n\n')
    }
    return result
  }
  
  // If too few paragraphs, just duplicate for all chapters
  for (let ch = startChapter; ch <= endChapter; ch++) {
    result[ch] = text
  }
  
  return result
}

// Build the output JSON
const output = {
  metadata: {
    author: "Gavin Ortlund",
    title: "Explaining Every Chapter of Revelation",
    type: "Video Commentary",
    year: 2024,
    source: "YouTube",
    originalUrl: "https://www.youtube.com/watch?v=hnphJMQ1AwA",
    audioUrl: null
  },
  introduction,
  commentaries
}

// Write output
const outputPath = path.join(path.dirname(new URL(import.meta.url).pathname.substring(1)), '..', 'src', 'data', 'ortlund-commentary.json')
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

console.log(`Parsed ${introduction.length} introduction sections`)
console.log(`Parsed ${commentaries.length} chapter commentaries (covering chapters 1-22)`)

// Show chapter breakdown
const chapterNumbers = commentaries.map(c => c.chapter).sort((a, b) => a - b)
console.log(`Chapters covered: ${[...new Set(chapterNumbers)].join(', ')}`)
console.log(`Output written to ${outputPath}`)
