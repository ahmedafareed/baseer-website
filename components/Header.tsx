import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import ClientHeader from './ClientHeader'

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Baseer
            </Link>
            <div className="flex gap-4 items-center">
              <form action="/search" method="GET" className="flex-grow max-w-md mx-4">
                <div className="relative">
                  <Input
                    type="text"
                    name="q"
                    placeholder="Search for products..."
                    className="pr-10"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
              <ClientHeader />
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}

