'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { AuthProvider } from '@/lib/auth'
import { CartProvider } from '@/lib/cart'
import { WishlistProvider } from '@/lib/wishlist'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider supabaseClient={supabase}>
        <CartProvider supabaseClient={supabase}>
          <WishlistProvider supabaseClient={supabase}>
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

