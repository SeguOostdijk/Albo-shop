'use client'

import React from "react"

import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          '--normal-bg': '#f3f4f6',
          '--normal-text': 'hsl(var(--foreground))',
          '--normal-border': '#000000',
          '--width': '340px',
          '--font-size': '15px',
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          border: '1.5px solid #000000',
          borderRadius: '10px',
          padding: '14px 18px',
          fontSize: '15px',
          background: '#f3f4f6',
          textAlign: 'center',
          justifyContent: 'center',
        }
      }}
      {...props}
    />
  )
}

export { Toaster }