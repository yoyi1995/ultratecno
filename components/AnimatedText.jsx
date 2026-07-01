'use client'

import { useState, useEffect } from 'react'

const words = [
  'Repuestos de Impresoras',
  'Partes de Laptops',
  'Componentes de PC',
  'MOSFETs y Electrónica',
  'Tintas y Cartuchos',
  'Flex y Cables',
  'Accesorios Tech',
]

export default function AnimatedText() {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWord]
    let timeout

    if (!isDeleting) {
      if (displayedText.length < word.length) {
        timeout = setTimeout(() => {
          setDisplayedText(word.slice(0, displayedText.length + 1))
        }, 80)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(word.slice(0, displayedText.length - 1))
        }, 40)
      } else {
        setIsDeleting(false)
        setCurrentWord((prev) => (prev + 1) % words.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentWord])

  return (
    <span className="text-blue-200">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}