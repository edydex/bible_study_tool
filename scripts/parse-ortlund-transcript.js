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
        // Single chapter - extract verse-specific commentary
        const verseCommentaries = extractVerseCommentaries(section.text, startChapter, section.timestamp, idCounter)
        idCounter += verseCommentaries.length
        commentaries.push(...verseCommentaries)
      } else {
        // Multi-chapter section - try to split by context or create entries for each
        const splitContent = tryToSplitByChapter(section.text, startChapter, endChapter)
        
        for (let ch = startChapter; ch <= endChapter; ch++) {
          const chapterText = splitContent[ch] || section.text
          const verseCommentaries = extractVerseCommentaries(chapterText, ch, section.timestamp, idCounter, `Chapters ${startChapter}–${endChapter}`)
          idCounter += verseCommentaries.length
          commentaries.push(...verseCommentaries)
        }
      }
    } else {
      console.warn(`Unknown section type: ${section.title}`)
    }
  }
}

/**
 * Extract verse-specific commentaries from chapter text
 * Returns array of commentary objects, including a chapter-level one if needed
 */
function extractVerseCommentaries(text, chapter, timestamp, startId, originalSection = null) {
  const results = []
  const paragraphs = text.split(/\r?\n\r?\n+/)
  
  // Patterns to find verse references
  const versePatterns = [
    // "verse 3" or "verses 3-5" or "verses 3 to 5" or "verses 3 and 4"
    /\bverses?\s+(\d+)(?:\s*[-–to]+\s*(\d+))?(?:\s+(?:and|,)\s*(\d+))?/gi,
    // "Revelation 1:3" or "Rev 1:3" or "1:3"
    /\b(?:revelation|rev)?\s*\d+:(\d+)(?:\s*[-–]\s*(\d+))?/gi,
    // "in verse 3" or "at verse 3"
    /\b(?:in|at|from|see|here in)\s+verse\s+(\d+)/gi,
    // "v. 3" or "v3" or "vv. 3-5"
    /\bvv?\.?\s*(\d+)(?:\s*[-–]\s*(\d+))?/gi
  ]
  
  // Track which paragraphs are assigned to which verses
  const paragraphVerses = new Map() // paragraphIndex -> Set of verse numbers
  const verseParagraphs = new Map() // verse number -> Set of paragraph indices
  
  // Scan each paragraph for verse references
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]
    const versesInPara = new Set()
    
    for (const pattern of versePatterns) {
      pattern.lastIndex = 0 // Reset regex
      let match
      while ((match = pattern.exec(para)) !== null) {
        const startVerse = parseInt(match[1])
        const endVerse = match[2] ? parseInt(match[2]) : startVerse
        const additionalVerse = match[3] ? parseInt(match[3]) : null
        
        // Add all verses in range (but sanity check - verses should be 1-30ish)
        for (let v = startVerse; v <= Math.min(endVerse, 50); v++) {
          versesInPara.add(v)
        }
        if (additionalVerse && additionalVerse <= 50) {
          versesInPara.add(additionalVerse)
        }
      }
    }
    
    if (versesInPara.size > 0) {
      paragraphVerses.set(i, versesInPara)
      for (const v of versesInPara) {
        if (!verseParagraphs.has(v)) {
          verseParagraphs.set(v, new Set())
        }
        verseParagraphs.get(v).add(i)
      }
    }
  }
  
  // If we found verse-specific content, create entries
  if (verseParagraphs.size > 0) {
    // Group consecutive verses that share paragraphs
    const verseGroups = groupVerses(verseParagraphs, paragraphVerses, paragraphs)
    
    for (const group of verseGroups) {
      const verseList = group.verses.map(v => ({ chapter, verse: v }))
      const verseRef = group.verses.length === 1 
        ? `${chapter}:${group.verses[0]}`
        : `${chapter}:${group.verses[0]}-${group.verses[group.verses.length - 1]}`
      
      results.push({
        id: `ortlund_${startId + results.length}`,
        reference: verseRef,
        timestamp,
        chapter,
        text: group.text,
        verses: verseList,
        ...(originalSection && { originalSection })
      })
    }
    
    // Check if there's remaining content that's not verse-specific (intro paragraphs)
    const assignedParagraphs = new Set()
    for (const group of verseGroups) {
      for (const idx of group.paragraphIndices) {
        assignedParagraphs.add(idx)
      }
    }
    
    const unassignedParagraphs = paragraphs.filter((_, i) => !assignedParagraphs.has(i))
    if (unassignedParagraphs.length > 0 && unassignedParagraphs.some(p => p.trim().length > 100)) {
      // Add chapter-level commentary for intro/overview content
      results.unshift({
        id: `ortlund_${startId + results.length}`,
        reference: `Chapter ${chapter} Overview`,
        timestamp,
        chapter,
        text: unassignedParagraphs.join('\n\n'),
        verses: null,
        ...(originalSection && { originalSection })
      })
    }
  } else {
    // No verse references found - keep as chapter-level
    results.push({
      id: `ortlund_${startId}`,
      reference: `Chapter ${chapter}`,
      timestamp,
      chapter,
      text,
      verses: null,
      ...(originalSection && { originalSection })
    })
  }
  
  return results
}

/**
 * Group verses that share paragraphs or are consecutive
 */
function groupVerses(verseParagraphs, paragraphVerses, paragraphs) {
  const groups = []
  const processedVerses = new Set()
  
  // Sort verses
  const allVerses = [...verseParagraphs.keys()].sort((a, b) => a - b)
  
  for (const verse of allVerses) {
    if (processedVerses.has(verse)) continue
    
    // Find all paragraphs for this verse
    const parasForVerse = verseParagraphs.get(verse)
    
    // Find all verses that share these paragraphs
    const relatedVerses = new Set([verse])
    for (const paraIdx of parasForVerse) {
      const versesInPara = paragraphVerses.get(paraIdx)
      if (versesInPara) {
        for (const v of versesInPara) {
          relatedVerses.add(v)
        }
      }
    }
    
    // Also add consecutive verses
    const sortedRelated = [...relatedVerses].sort((a, b) => a - b)
    const minV = sortedRelated[0]
    const maxV = sortedRelated[sortedRelated.length - 1]
    for (let v = minV; v <= maxV; v++) {
      if (verseParagraphs.has(v)) {
        relatedVerses.add(v)
      }
    }
    
    // Collect all paragraphs for this group
    const allParas = new Set()
    for (const v of relatedVerses) {
      const paras = verseParagraphs.get(v)
      if (paras) {
        for (const p of paras) {
          allParas.add(p)
        }
      }
    }
    
    // Mark all as processed
    for (const v of relatedVerses) {
      processedVerses.add(v)
    }
    
    const sortedVerses = [...relatedVerses].sort((a, b) => a - b)
    const sortedParaIndices = [...allParas].sort((a, b) => a - b)
    
    groups.push({
      verses: sortedVerses,
      paragraphIndices: sortedParaIndices,
      text: sortedParaIndices.map(i => paragraphs[i]).join('\n\n')
    })
  }
  
  return groups
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
