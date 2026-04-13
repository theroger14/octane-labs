"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [user, setUser] = useState(undefined) // undefined = loading

  // Track auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load wishlist when user is known
  useEffect(() => {
    if (user === undefined) return
    if (!user) { setWishlistIds(new Set()); return }

    supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setWishlistIds(new Set((data || []).map(r => r.product_id)))
      })
  }, [user])

  // Toggle a product in/out of wishlist — returns true if added, false if removed
  const toggle = useCallback(async (productId) => {
    if (!user) return null // signals "not logged in"

    const inWishlist = wishlistIds.has(productId)

    if (inWishlist) {
      await supabase.from("wishlists").delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
      setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s })
      return false
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId })
      setWishlistIds(prev => new Set([...prev, productId]))
      return true
    }
  }, [user, wishlistIds])

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds])

  return (
    <WishlistContext.Provider value={{
      isInWishlist,
      toggle,
      count: wishlistIds.size,
      isLoggedIn: !!user,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider")
  return ctx
}
