'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { signIn, signUp } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Reset form state when the modal opens or mode changes
    if (isOpen) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setIsSubmitting(false)
    }
  }, [isOpen, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        toast.success('Signed in successfully')
      } else {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        await signUp(email, password)
        toast.success('Signed up successfully')
      }
      onClose()
    } catch (error) {
      toast.error(`Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

