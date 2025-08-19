"use client"

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkInput(false)
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 px-2"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 px-2"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-8 px-2"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className="h-8 px-2"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className="h-8 px-2"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className="h-8 px-2"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className="h-8 px-2"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <Button
        type="button"
        variant={editor.isActive('link') ? 'default' : 'outline'}
        size="sm"
        onClick={() => setShowLinkInput(!showLinkInput)}
        className="h-8 px-2"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="h-8 px-2"
      >
        <Unlink className="h-4 w-4" />
      </Button>

      {showLinkInput && (
        <div className="flex items-center gap-2 ml-2">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8 w-48"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setLink()
              }
            }}
          />
          <Button type="button" size="sm" onClick={setLink} className="h-8 px-3">
            Set
          </Button>
        </div>
      )}
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4 min-h-[200px]',
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!mounted) {
    return (
      <div className={className}>
        <div className="border border-gray-300 rounded-md bg-white p-4 min-h-[200px]">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <MenuBar editor={editor} />
      <div className="border border-t-0 border-gray-300 rounded-b-md bg-white">
        <EditorContent editor={editor} />
        {!value && (
          <div className="absolute top-16 left-4 text-gray-400 pointer-events-none">
            {placeholder || 'Start typing...'}
          </div>
        )}
      </div>
    </div>
  )
}
