import MarketingNavbar from "./_components/MarketingNavbar"
import Footer from "@/components/Footer"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"
import CartDrawer from "@/components/CartDrawer"

export default function MarketingLayout({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <MarketingNavbar />
        {children}
        <CartDrawer />
        <Footer />
      </WishlistProvider>
    </CartProvider>
  )
}
