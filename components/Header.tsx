import Link from 'next/link'
import ClientHeader from './ClientHeader'
import SearchForm from './SearchForm'

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
              <SearchForm />
              <ClientHeader />
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}

