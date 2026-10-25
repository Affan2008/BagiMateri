'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Code2,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'
import { useCallback, useRef } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: { loading: 'lazy', class: 'max-w-full rounded-lg' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[var(--primary)] underline' },
      }),
      CodeBlock.configure({
        HTMLAttributes: { class: 'not-prose' },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your lecture notes here…',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const insertMathInline = useCallback(() => {
    if (!editor) return
    const formula = window.prompt('Enter LaTeX expression (inline)', 'x^2 + y^2')
    if (!formula) return
    editor.chain().focus().insertContent(`$${formula}$`).run()
  }, [editor])

  const insertMathBlock = useCallback(() => {
    if (!editor) return
    const formula = window.prompt(
      'Enter LaTeX expression (block)',
      '\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}'
    )
    if (!formula) return
    editor.chain().focus().insertContent(`\n$$${formula}$$\n`).run()
  }, [editor])

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) {
          const data = await res.json()
          alert(data.error ?? 'Upload failed.')
          return
        }
        const { url } = await res.json()
        editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      } catch {
        alert('Upload failed. Please try again.')
      }
    },
    [editor]
  )

  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
    disabled,
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
    disabled?: boolean
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        if (!disabled) onClick()
      }}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
          : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )

  return (
    <div className="tiptap-editor">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-[var(--border)] bg-[var(--card)] rounded-t-lg">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Add link">
          <LinkIcon size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click()
          }}
          title="Upload image"
        >
          <ImageIcon size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline code"
        >
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code block"
        >
          <Code2 size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton onClick={insertMathInline} title="Insert inline math ($…$)">
          <span className="text-xs font-mono font-bold">∑</span>
        </ToolbarButton>
        <ToolbarButton onClick={insertMathBlock} title="Insert math block ($$…$$)">
          <span className="text-xs font-mono font-bold">∬</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
          e.target.value = ''
        }}
      />

      <EditorContent editor={editor} />
    </div>
  )
}
