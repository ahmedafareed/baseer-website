'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Header from '@/components/Header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Profile = {
  id: string
  name: string
  age: number | null
  gender: string | null
  social_media_links: { [key: string]: string }
  phone_number: string | null
  shipping_address: string | null
  favorite_payment_method: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    id: '',
    name: '',
    age: null,
    gender: null,
    social_media_links: {},
    phone_number: null,
    shipping_address: null,
    favorite_payment_method: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user, deleteProfile } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      router.push('/login')
    }
  }, [user])

  const fetchProfile = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (error) {
      toast.error('Failed to fetch profile')
    } else {
      setProfile(data || profile)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        ...profile
      })
      .select()

    if (error) {
      toast.error('Failed to update profile')
    } else {
      setProfile(data[0])
      toast.success('Profile updated successfully')
      router.push('/') // Redirect to main page after update
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      social_media_links: { ...prev.social_media_links, [platform]: value }
    }))
  }

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile()
      toast.success('Profile deleted successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to delete profile')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Header onOpenAuth={() => {}}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" value={profile.age || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" name="gender" value={profile.gender || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Social Media Links</Label>
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <div key={platform} className="mt-2">
                <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                <Input
                  id={platform}
                  value={profile.social_media_links[platform] || ''}
                  onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="shipping_address">Shipping Address</Label>
            <Textarea id="shipping_address" name="shipping_address" value={profile.shipping_address || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="favorite_payment_method">Favorite Payment Method</Label>
            <Input id="favorite_payment_method" name="favorite_payment_method" value={profile.favorite_payment_method || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-between">
            <Button type="submit">Update Profile</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Profile</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProfile}>
                    Yes, delete my profile
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </Header>
  )
}

