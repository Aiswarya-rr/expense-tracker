"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, Download, Menu, Coins, LineChart, Zap } from "lucide-react"

export default function RootPage() {
  const [animated, setAnimated] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [bulletIndex, setBulletIndex] = useState(0)

  const features = [
    { title: 'Track Expenses', desc: 'Monitor your spending in real-time', transform: 'translateZ(0px) rotateY(0deg)', bullets: ['Real-time tracking', 'Category breakdown', 'Visual charts'] },
    { title: 'Budget Alerts', desc: 'Get notified when you exceed limits', transform: 'translateZ(80px) rotateY(45deg)', bullets: ['Smart notifications', 'Limit warnings', 'Email alerts'] },
    { title: 'AI Insights', desc: 'Receive personalized financial advice', transform: 'translateZ(80px) rotateY(90deg)', bullets: ['Personalized tips', 'Spending analysis', 'Future predictions'] },
    { title: 'Receipt Scan', desc: 'Upload receipts with OCR technology', transform: 'translateZ(80px) rotateY(135deg)', bullets: ['OCR extraction', 'Auto-categorization', 'Instant logging'] }
  ]

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [features.length])

  useEffect(() => {
    setBulletIndex(0)
    const interval = setInterval(() => {
      setBulletIndex(prev => prev < 3 ? prev + 1 : 3)
    }, 800)
    return () => clearInterval(interval)
  }, [currentFeature])

  return (
    <div className="relative min-h-screen bg-black text-purple-100 overflow-x-hidden">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute right-1/2 bottom-[-120px] h-[500px] w-[500px] translate-x-1/2 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-700/20 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-extrabold">
              <span className="text-white">Purple</span><span className="text-purple-400">Bank</span>
            </div>
          </Link>
          <nav className="hidden gap-8 md:flex text-purple-200/80">
            <a href="#features" className="hover:text-white transition">Home</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#contact" className="hover:text-white transition">Contact Us</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/signup" className="hidden rounded-full border border-purple-700/60 px-4 py-2 text-sm text-purple-200 hover:bg-purple-800/40 md:block transition">
              Download App
            </Link>
            <button className="md:hidden rounded-lg border border-purple-800 p-2 text-purple-300 hover:bg-purple-900/40">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pt-10 md:pt-20">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
              <span className="block">Level Up Yourr</span>
              <span className="bg-gradient-to-b from-purple-300 to-purple-500 bg-clip-text text-transparent">Finance</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-purple-300 md:mt-6 md:text-lg">
              Empowering youry financial journey with innovative solutions.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-white shadow-lg shadow-purple-900/40 transition hover:scale-105 hover:bg-purple-600">
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-purple-700/60 px-6 py-3 text-purple-200 transition hover:bg-purple-900/40">
                Login
              </Link>
            </div>
          </div>

          {/* Phone mock + floating cards */}
          <div className="relative mx-auto mt-14 flex max-w-4xl items-center justify-center">
            {/* Floating left card */}
            <div className={`absolute left-6 top-8 hidden -rotate-12 md:block transition-all duration-1000 hover:scale-105 animate-float ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 p-4 shadow-2xl shadow-purple-900/50">
                <div className="text-sm font-semibold text-white">Add Friends</div>
                <div className="mt-1 w-48 text-xs text-purple-300">Invite friends to split expenses and save smarter together.</div>
                <div className="mt-3 flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-purple-600" />
                  <div className="h-7 w-7 rounded-full bg-purple-500" />
                  <div className="h-7 w-7 rounded-full bg-purple-400" />
                </div>
              </div>
            </div>
            {/* Floating right card */}
            <div className={`absolute right-6 bottom-6 hidden rotate-12 md:block transition-all duration-1000 hover:scale-105 animate-float ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '1.5s', transitionDelay: '0.2s' }}>
              <div className="rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 p-4 shadow-2xl shadow-purple-900/50">
                <div className="text-sm font-semibold text-white">Spending</div>
                <div className="mt-2 h-16 w-40 rounded-md bg-purple-700/40">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,.2),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,.08),transparent_40%)]" />
                </div>
              </div>
            </div>

            {/* Phone frame */}
            <div className="relative h-[520px] w-[270px] rounded-[42px] border border-purple-700/60 bg-gradient-to-b from-zinc-900 to-black p-4 shadow-2xl shadow-purple-900/40">
              {/* Dynamic island */}
              <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-black/80" />
              {/* Screen */}
              <div className="h-[450px] overflow-hidden rounded-3xl bg-gradient-to-b from-purple-950 to-black p-4">
                <div className="text-sm text-purple-200/80">Total Balance</div>
                <div className="mt-2 rounded-xl bg-gradient-to-br from-purple-700 to-fuchsia-700 p-4 text-white shadow-lg">
                  <div className="text-xs opacity-80">Send Money</div>
                  <div className="mt-3 text-lg font-semibold tracking-wider">1478 2255 4595 9874</div>
                  <div className="mt-2 flex justify-between text-[10px] opacity-80">
                    <span>12/32</span>
                    <span>278</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-purple-800/60 bg-purple-900/30 p-3">
                    <div className="text-xs text-purple-300">Spending</div>
                    <div className="mt-2 h-16 rounded-md bg-purple-800/40" />
                  </div>
                  <div className="rounded-xl border border-purple-800/60 bg-purple-900/30 p-3">
                    <div className="text-xs text-purple-300">Insights</div>
                    <div className="mt-2 h-16 rounded-md bg-purple-800/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Phone Animation Section */}
        <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-300 mb-4">Experience the Future of Finance</h2>
              <p className="text-lg text-purple-400">Watch our features come to life in stunning 3D animation</p>
            </div>

            {/* Phone mock + feature text */}
            <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-12">
              {/* Left side text */}
              <div className="hidden lg:block w-80 text-left">
                <div className="transition-all duration-1000 opacity-100">
                  <h3 className="text-3xl font-bold text-purple-300 mb-4">{features[currentFeature].title}</h3>
                  <p className="text-lg text-purple-400 mb-6">{features[currentFeature].desc}</p>
                  <div className="space-y-3">
                    {features[currentFeature].bullets.map((bullet, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 text-purple-200 transition-all duration-500 ${
                          index < bulletIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone frame */}
              <div className="relative" style={{ perspective: '1000px' }}>
                <div className="relative h-[520px] w-[270px] rounded-[42px] border border-purple-700/60 bg-gradient-to-b from-zinc-900 to-black p-4 shadow-2xl shadow-purple-900/40">
                  {/* Dynamic island */}
                  <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-black/80" />
                  {/* Screen with 3D card */}
                  <div className="relative h-[450px] overflow-hidden rounded-3xl bg-gradient-to-b from-purple-950 to-black p-4">
                    <div className="text-sm text-purple-200/80">Total Balance</div>
                    <div className="mt-2 rounded-xl bg-gradient-to-br from-purple-700 to-fuchsia-700 p-4 text-white shadow-lg">
                      <div className="text-xs opacity-80">Send Money</div>
                      <div className="mt-3 text-lg font-semibold tracking-wider">1478 2255 4595 9874</div>
                      <div className="mt-2 flex justify-between text-[10px] opacity-80">
                        <span>12/32</span>
                        <span>278</span>
                      </div>
                    </div>
                    {/* Animated card */}
                    <div
                      className="absolute top-1/2 left-1/2 w-32 h-20 bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-3 shadow-xl transition-all duration-1000"
                      style={{
                        transform: `translate(-50%, -50%) ${features[currentFeature].transform}`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="text-xs text-white font-semibold">{features[currentFeature].title.split(' ')[0]}</div>
                      <div className="mt-1 h-8 rounded bg-purple-700/40"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transform Journey Section */}
        <section className="relative py-24 bg-gradient-to-b from-black to-purple-950/20 border-t border-purple-900/40 overflow-hidden">
          {/* Big bottom glow arc */}
          <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[380px] w-[1200px] rounded-[999px] bg-gradient-to-t from-purple-700/30 to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-purple-100">Transform Your Crypto Journey</h2>
              <p className="mt-3 text-purple-300">Experience enhanced security, speed, and convenience with our cutting-edge wallet.</p>
              <p className="mt-1 text-xs text-purple-500/80">Created By PurpleBank</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Card 1 */}
              <div className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl transition-transform hover:-translate-y-1 border border-purple-800/40"
                   style={{background: 'radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,0.25) 0%, rgba(0,0,0,0.6) 60%), linear-gradient(180deg, rgba(76,29,149,0.6) 0%, rgba(3,7,18,0.8) 100%)'}}>
                {/* Decorative lights */}
                <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute right-4 top-6 h-10 w-10 rotate-45 rounded-lg bg-white/10 blur" />

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40">
                    <Coins className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Multi-Currency Support</h3>
                  <p className="mt-3 text-sm leading-6 text-purple-200/90">Store and manage multiple currencies in a single, powerful wallet.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl transition-transform hover:-translate-y-1 border border-purple-800/40"
                   style={{background: 'radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,0.25) 0%, rgba(0,0,0,0.6) 60%), linear-gradient(180deg, rgba(55,20,122,0.7) 0%, rgba(3,7,18,0.85) 100%)'}}>
                {/* Decorative grid lines */}
                <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_24px)]" />
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40">
                    <LineChart className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Price Forecasting</h3>
                  <p className="mt-3 text-sm leading-6 text-purple-200/90">Receive price predictions and AI-based insights to make informed decisions.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative overflow-hidden rounded-[28px] p-6 shadow-2xl transition-transform hover:-translate-y-1 border border-purple-800/40"
                   style={{background: 'radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,0.25) 0%, rgba(0,0,0,0.6) 60%), linear-gradient(180deg, rgba(76,29,149,0.6) 0%, rgba(3,7,18,0.85) 100%)'}}>
                <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Fast Transactions</h3>
                  <p className="mt-3 text-sm leading-6 text-purple-200/90">Instantly send and receive money worldwide without delays.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-purple-900/40 py-10 text-center text-sm text-purple-300/80">
          © {new Date().getFullYear()} PurpleBank. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
