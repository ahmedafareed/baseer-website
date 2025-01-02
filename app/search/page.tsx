import { Suspense } from 'react'
import SearchContent from './SearchContent'

export default function SearchPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent initialQuery={query} />
    </Suspense>
  )
}

