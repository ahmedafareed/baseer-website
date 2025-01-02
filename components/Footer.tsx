import React from 'react'
import Link from 'next/link'
import { AccessibilityPanel } from './AccessibilityPanel'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Baseer. All rights reserved.
          </p>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              {/* Add more footer links here */}
            </ul>
          </nav>
        </div>
        <AccessibilityPanel />
      </div>
    </footer>
  )
}

