'use client'

import React from 'react'
import { useAccessibility } from '@/lib/AccessibilityContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSettings } = useAccessibility()

  return (
    <div className="p-4 bg-background border-t">
      <h2 className="text-lg font-semibold mb-4">Accessibility Settings</h2>
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="fontSize" className="block mb-2">Font Size</label>
          <Select
            value={settings.fontSize}
            onValueChange={(value) => updateSettings({ fontSize: value as 'normal' | 'large' | 'extra-large' })}
          >
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="extra-large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="contrast" className="block mb-2">Contrast</label>
          <Select
            value={settings.contrast}
            onValueChange={(value) => updateSettings({ contrast: value as 'normal' | 'high' })}
          >
            <SelectTrigger id="contrast">
              <SelectValue placeholder="Select contrast" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High Contrast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="fontFamily" className="block mb-2">Font Family</label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => updateSettings({ fontFamily: value as 'sans' | 'serif' })}
          >
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="colorTheme" className="block mb-2">Color Theme</label>
          <Select
            value={settings.colorTheme}
            onValueChange={(value) => updateSettings({ colorTheme: value as 'light' | 'dark' | 'high-contrast' })}
          >
            <SelectTrigger id="colorTheme">
              <SelectValue placeholder="Select color theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="high-contrast">High Contrast</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

