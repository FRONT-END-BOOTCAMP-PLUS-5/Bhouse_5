'use client'

import { useEffect, useRef, useState } from 'react'
import QuillResizeImage from 'quill-resize-image'
import styles from './PostQuill.module.css'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  onParsed: (title: string, content: string) => void
}

export default function QuillEditor({ value, onChange, onParsed }: QuillEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<any>(null)

  useEffect(() => {
    const initQuill = async () => {
      if (!editorRef.current || editorRef.current.children.length > 0) return

      const Quill = (await import('quill')).default
      const ImageResize = QuillResizeImage
      const QuillImageDropAndPaste = (await import('quill-image-drop-and-paste')).default

      Quill.register('modules/imageResize', ImageResize)
      Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

      const q = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: function () {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')
                input.click()
                input.onchange = () => {
                  const file = input.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    const base64 = reader.result as string
                    const range = q.getSelection()
                    q.insertEmbed(range?.index || 0, 'image', base64)
                  }
                  reader.readAsDataURL(file)
                }
              },
              link: function () {
                const href = prompt('링크 주소 입력', 'https://')
                if (href) {
                  const range = q.getSelection()
                  q.format('link', href)
                }
              },
            },
          },
          imageResize: {
            modules: ['Resize', 'DisplaySize'],
            displayStyles: {
              position: 'absolute',
              backgroundColor: 'white',
              border: '1px dashed #444',
              zIndex: 100,
            },
            handleStyles: {
              backgroundColor: '#fff',
              border: '1px solid #777',
              width: '10px',
              height: '10px',
            },
          },
          imageDropAndPaste: true,
        },
        placeholder: '내용을 입력하세요',
      })

      q.on('text-change', () => {
        onChange(q.root.innerHTML)
      })

      q.root.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return

        const selection = q.getSelection()
        if (!selection) return

        const [leaf] = q.getLeaf(selection.index)
        const domNode = leaf?.domNode as HTMLElement
        if (!domNode) return

        // 실제 이미지 노드 또는 리사이즈 wrapper 안의 이미지 포함
        const imgEl = domNode.tagName === 'IMG' ? domNode : domNode.querySelector?.('img')

        if (imgEl) {
          // 이미지가 Quill blot으로 존재할 경우 삭제
          const blot = Quill.find(imgEl)
          if (blot) {
            blot.remove()
            e.preventDefault()
          }
        }
      })

      const observer = new MutationObserver(() => {
        document.querySelectorAll('#editor-resizer').forEach((el) => {
          ;(el as HTMLElement).style.backgroundColor = 'transparent'
          ;(el as HTMLElement).style.border = '1px dashed #e6e6e6'
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      setQuill(q)
    }

    initQuill()
  }, [onChange])

  const handlePublish = () => {
    const title = titleRef.current?.value.trim()
    if (!title) {
      alert('제목을 입력해주세요')
      return
    }

    const html = quill?.root.innerHTML || ''
    onParsed(title, html)
  }

  return (
    <div className={styles.wrapper}>
      <input ref={titleRef} type="text" className={styles.titleInput} placeholder="제목을 입력하세요" />
      <div ref={editorRef} className={styles.editorArea}></div>
      <button onClick={handlePublish} className={styles.publishButton}>
        발행하기
      </button>
    </div>
  )
}
