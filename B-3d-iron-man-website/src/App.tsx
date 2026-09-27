import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BootLoader } from './components/BootLoader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { StatsBar } from './components/StatsBar'
import { TechSection } from './components/TechSection'
import { MarksSection } from './components/MarksSection'
import { About } from './components/About'
import { QuoteSection } from './components/QuoteSection'
import { Footer } from './components/Footer'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-void font-body text-white">
      <AnimatePresence>
        {!booted && <BootLoader onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <Navbar />
      <main>
        <Hero booted={booted} />
        <StatsBar />
        <TechSection />
        <MarksSection />
        <About />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  )
}
