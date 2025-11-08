
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <motion.div 
      className="w-11/12 md:w-7/12 mx-auto py-20 flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1 
        className="font-bold text-5xl md:text-7xl text-center mb-6 max-w-10/12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Get paid for your social media
      </motion.h1>

      <motion.p 
        className="text-md md:text-lg text-center mb-6 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        Turn your social media activity into real money — like, follow, comment, or share to start earning instantly.
      </motion.p>

      <motion.button 
        className="py-3 px-8 bg-black text-white rounded-full hover:bg-amber-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05, backgroundColor: "#fbbf24" }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  )
}

export default Hero
