'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

type Profile = {
  id: string
  name: string
  age: number | null
  gender: string | null
  social_media_links: { [key: string]: string }
  phone_number: string | null
  shipping_address: string | null
  favorite_payment_method: string | null
  profile_picture_url: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  deleteProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const { data: isAdminData } = await supabase.rpc('is_admin', { user_id: currentUser.id })
        setIsAdmin(!!isAdminData)
        await fetchProfile(currentUser.id)
      } else {
        setIsAdmin(false)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    if (data) {
      setProfile(data)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: email.split('@')[0], // Use part of email as initial name
          age: null,
          gender: null,
          social_media_links: {},
          phone_number: null,
          shipping_address: null,
          favorite_payment_method: null,
          profile_picture_url: null
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear any local storage items
      localStorage.clear()

      // Clear all states
      setUser(null)
      setProfile(null)
      setIsAdmin(false)

      // Force a hard refresh of the page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const deleteProfile = async () => {
    if (!user) return

    // Delete profile from profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw profileError
    }

    // Delete user from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error('Error deleting user:', authError)
      throw authError
    }

    // Sign out the user
    await signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, signIn, signUp, signOut, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

