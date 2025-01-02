'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SupabaseSetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('https://fbeawzqjiyhvfewijxfe.supabase.co')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZWF3enFqaXlodmZld2lqeGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzcyNTcsImV4cCI6MjA1MDcxMzI1N30.sA1_zZwYyMGy052w23lVuBSLI-1zLoF3hpFD56foB_8')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real-world scenario, you would securely store these credentials
    // For this example, we'll just simulate saving them
    localStorage.setItem('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl)
    localStorage.setItem('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey)

    toast.success('Supabase credentials saved successfully')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Supabase Setup
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="supabaseUrl">Supabase URL</Label>
            <Input
              id="supabaseUrl"
              name="supabaseUrl"
              type="text"
              required
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
            />
          </div>
          <div>
            <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
            <Input
              id="supabaseAnonKey"
              name="supabaseAnonKey"
              type="password"
              required
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="your-anon-key"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Credentials
          </Button>
        </form>
      </div>
    </div>
  )
}

