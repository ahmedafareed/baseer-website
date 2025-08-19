'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q')
    if (query && typeof query === 'string' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-grow max-w-md mx-4">
      <div className="relative">
        <Input
          type="text"
          name="q"
          placeholder="Search for products..."
          className="pr-10"
          minLength={2}
          required
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
  )
}

