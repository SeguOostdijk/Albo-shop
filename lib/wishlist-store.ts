"use client"

import { create } from "zustand"
import type { Product } from "./products"

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      if (state.items.find((item) => item.id === product.id)) {
        return state
      }
      return { items: [...state.items, product] }
    })
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }))
  },

  toggleItem: (product) => {
    const isInWishlist = get().isInWishlist(product.id)
    if (isInWishlist) {
      get().removeItem(product.id)
    } else {
      get().addItem(product)
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId)
  },
}))
