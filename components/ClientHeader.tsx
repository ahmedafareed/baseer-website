'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingCart, LogOut, User, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useWishlist } from '@/lib/wishlist'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthModal from '@/components/AuthModal'

export default function ClientHeader() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const { user, isAdmin, signOut } = useAuth()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [profile, setProfile] = useState<{ name: string, profile_picture_url: string } | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setCartCount(cartItems.length)
  }, [cartItems])

  useEffect(() => {
    setWishlistCount(wishlistItems.length)
  }, [wishlistItems])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, profile_picture_url')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
  }

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // No need for toast success here as page will refresh
    } catch (error) {
      toast.error("Failed to sign out")
      console.error('Sign out error:', error)
    }
  }

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.profile_picture_url} alt={profile?.name} />
                <AvatarFallback>{profile?.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name || user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/supabase-setup")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Supabase Setup</span>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem onClick={() => router.push("/admin/orders")}>
                  Admin Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/admin/products")}>
                  Admin Products
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            onClick={() => handleOpenAuth("signin")}
            variant="outline"
            size="sm"
          >
            Sign In
          </Button>
          <Button
            onClick={() => handleOpenAuth("signup")}
            size="sm"
          >
            Sign Up
          </Button>
        </>
      )}
      <Button
        onClick={() => router.push("/wishlist")}
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Heart className="h-6 w-6" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Button>
      <Button
        onClick={() => router.push("/cart")}
        variant="ghost"
        size="icon"
        className="relative"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  )
}

