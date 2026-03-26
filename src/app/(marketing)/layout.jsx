import MarketingNavbar from "./_components/MarketingNavbar"
import { CartProvider } from "@/context/CartContext"
import CartDrawer from "@/components/CartDrawer"

export default function MarketingLayout({ children }) {
  return (
    <CartProvider>
      <MarketingNavbar />
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
