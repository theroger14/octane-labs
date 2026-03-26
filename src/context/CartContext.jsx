"use client"

import { createContext, useContext, useEffect, useReducer, useState } from "react"

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case "REMOVE":
      return state.filter(i => i.id !== action.id)
    case "SET_QTY":
      return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)
    case "CLEAR":
      return []
    case "INIT":
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ol_cart")
      if (saved) dispatch({ type: "INIT", items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem("ol_cart", JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    dispatch({ type: "ADD", item })
    setDrawerOpen(true)
  }
  const removeItem = (id) => dispatch({ type: "REMOVE", id })
  const setQty = (id, qty) => dispatch({ type: "SET_QTY", id, qty })
  const clearCart = () => dispatch({ type: "CLEAR" })

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, setQty, clearCart, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
