'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'

interface KatexRendererProps {
  html: string
}

/**
 * Renders HTML content, then post-processes $...$ and $$...$$ patterns
 * into KaTeX rendered math.
 */
export function KatexRenderer({ html }: KatexRendererProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    // Process text nodes for math delimiters
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    let node: Node | null

    while ((node = walker.nextNode())) {
      const text = (node as Text).textContent ?? ''
      if (text.includes('$')) {
        textNodes.push(node as Text)
      }
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent ?? ''
      const parent = textNode.parentNode
      if (!parent) continue

      const fragment = document.createDocumentFragment()
      let remaining = text
      let hasMatch = false

      while (remaining.length > 0) {
        // Try block math first ($$...$$)
        const blockMatch = remaining.match(/^\$\$([\s\S]*?)\$\$/)
        if (blockMatch) {
          hasMatch = true
          const span = document.createElement('span')
          span.className = 'katex-display'
          try {
            katex.render(blockMatch[1], span, { displayMode: true, throwOnError: false })
          } catch {
            span.textContent = blockMatch[0]
          }
          fragment.appendChild(span)
          remaining = remaining.slice(blockMatch[0].length)
          continue
        }

        // Try inline math ($...$)
        const inlineMatch = remaining.match(/^\$((?:[^$]|\\.)+?)\$/)
        if (inlineMatch) {
          hasMatch = true
          const span = document.createElement('span')
          try {
            katex.render(inlineMatch[1], span, { displayMode: false, throwOnError: false })
          } catch {
            span.textContent = inlineMatch[0]
          }
          fragment.appendChild(span)
          remaining = remaining.slice(inlineMatch[0].length)
          continue
        }

        // Plain text character
        const nextDollar = remaining.indexOf('$', 1)
        const plain = nextDollar > 0 ? remaining.slice(0, nextDollar) : remaining
        fragment.appendChild(document.createTextNode(plain))
        remaining = remaining.slice(plain.length)
      }

      if (hasMatch) {
        parent.replaceChild(fragment, textNode)
      }
    }

    // Also handle <pre><code> blocks containing $$...$$ (seed content uses these for display)
    el.querySelectorAll('pre > code').forEach((codeEl) => {
      const src = (codeEl.textContent ?? '').trim()
      const blockMatch = src.match(/^\$\$([\s\S]*?)\$\$$/)
      if (blockMatch) {
        const span = document.createElement('span')
        span.className = 'katex-display'
        try {
          katex.render(blockMatch[1], span, { displayMode: true, throwOnError: false })
        } catch {
          return
        }
        const pre = codeEl.closest('pre')
        if (pre?.parentNode) {
          pre.parentNode.replaceChild(span, pre)
        }
      }
    })
  }, [html])

  return (
    <div
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
