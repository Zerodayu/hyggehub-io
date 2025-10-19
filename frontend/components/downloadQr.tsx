"use client"

import React from 'react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'

export default function QrDownload() {
  const handleDownload = async () => {
    // public/qr1.png is served from the root at runtime
    const qrImagePath = '/qr1.png'

    try {
      // Fetch the image and create an object URL to ensure download works across browsers
      const res = await fetch(qrImagePath)
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'hyggehub-qr.png'
      document.body.appendChild(link)
      link.click()
      link.remove()

      // free memory
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
    }
  }

  return (
    <div>
      <Button
        variant="secondary"
        onClick={handleDownload}
        className="w-full"
      >
        <Download />
        Download QR Code
      </Button>
    </div>
  )
}
