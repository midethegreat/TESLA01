"use client"

import type React from "react"
import { useState } from "react"
import { Menu, X, Send, ChevronDown } from "lucide-react"

interface NavbarProps {
  onRegisterClick: () => void
  onLoginClick: () => void
  userProfilePicture?: string
  userName?: string
}

const Navbar: React.FC<NavbarProps> = ({ onRegisterClick, onLoginClick, userProfilePicture, userName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const telegramUrl = "https://t.me/Allyssabroker"

  return (
    <nav className="fixed w-full z-[100] bg-[#14120e]/90 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.location.reload()
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
                alt="Tesla"
                className="h-12 md:h-16 lg:h-20 tesla-red-filter transition-transform hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-10">
            <a
              href="#"
              className="text-amber-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-white transition"
            >
              Home
            </a>
            <a
              href="#plans"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              Investment
            </a>
            <a
              href="#how-it-works"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              Strategy
            </a>
            <a
              href="#about"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              About
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition font-black text-[9px] uppercase tracking-widest"
              >
                English <ChevronDown size={10} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#1a1814]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl min-w-[120px]">
                  <button className="w-full text-left px-4 py-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 uppercase tracking-widest">
                    English
                  </button>
                </div>
              )}
            </div>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition cursor-pointer"
            >
              <Send size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Telegram</span>
            </a>

            {/* Display user profile picture if logged in */}
            {userProfilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500">
                <img
                  src={userProfilePicture || "/placeholder.svg"}
                  alt={userName || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-white hover:text-amber-400 transition font-black text-[9px] uppercase tracking-widest"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="gradient-button px-6 py-2.5 rounded-full text-black font-black text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-amber-500/10 hover:scale-105 transition transform"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/5 rounded-xl transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Fixed to match top nav color and improve visibility */}
      {isOpen && (
        <div className="lg:hidden absolute w-[calc(100%-2rem)] left-4 top-24 z-[110] animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="bg-[#14120e] backdrop-blur-3xl border border-white/10 rounded-[2rem] py-10 px-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Subtle amber glow in background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="space-y-8 flex flex-col items-center relative z-10">
              <div className="flex flex-col items-center gap-6 w-full">
                <a
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="text-amber-400 text-sm font-black uppercase tracking-[0.3em] transition"
                >
                  Home
                </a>
                <a
                  href="#plans"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] hover:text-white transition"
                >
                  Investment
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] hover:text-white transition"
                >
                  Methodology
                </a>
                <a
                  href="#about"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] hover:text-white transition"
                >
                  Stats
                </a>
              </div>

              <div className="w-full h-[1px] bg-white/5"></div>

              <div className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] bg-white/5 px-6 py-2 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                English
              </div>

              <div className="w-full space-y-4 pt-4">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onLoginClick()
                  }}
                  className="w-full text-white py-4 font-black uppercase tracking-[0.2em] border border-white/10 rounded-2xl text-[10px] hover:bg-white/5 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onRegisterClick()
                  }}
                  className="w-full gradient-button text-black px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition transform"
                >
                  Register Account
                </button>
              </div>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 text-[8px] font-black uppercase tracking-widest pt-2 hover:text-amber-400 transition"
              >
                <Send size={12} className="text-amber-500/50" />
                Talk to Support
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
