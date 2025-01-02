'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ColorTheme = 'light' | 'dark' | 'high-contrast'

type AccessibilitySettings = {
  fontSize: 'normal' | 'large' | 'extra-large'
  contrast: 'normal' | 'high'
  fontFamily: 'sans' | 'serif'
  colorTheme: ColorTheme
}

type AccessibilityContextType = {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  fontFamily: 'sans',
  colorTheme: 'light'
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    document.documentElement.className = `${settings.colorTheme} ${settings.contrast === 'high' ? 'high-contrast' : ''}`
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings))
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

