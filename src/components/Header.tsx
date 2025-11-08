import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-row items-center justify-between py-6 px-4 md:px-8">
        <motion.h1 
          className="text-3xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          Logo
        </motion.h1>
        
        {/* Desktop buttons */}
        <motion.div 
          className="hidden md:flex flex-row gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button 
            className="py-2 px-8 bg-black text-white rounded-full"
            whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="py-2 px-6 bg-white text-black rounded-full border border-black"
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </motion.div>

        {/* Mobile hamburger menu */}
        <motion.button 
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden flex flex-col gap-3 px-4 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.button 
              className="py-2 px-8 bg-black text-white rounded-full"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button 
              className="py-2 px-6 bg-white text-black rounded-full border border-black"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Header