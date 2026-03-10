import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 md:pt-20">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
