
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Content */}
      <motion.div 
        className="w-11/12 md:w-7/12 mx-auto py-12 md:py-20 flex flex-col items-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
      {/* Breadcrumb */}
      <motion.p 
        className="text-sm text-gray-600 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        → Revolutionizing Social Advertising
      </motion.p>

      {/* Main Heading */}
      <motion.h1 
        className="font-bold text-4xl md:text-6xl text-center mb-6 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Turn Your Social Media{" "}
        <span className="text-purple-600">Into Income</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className="text-sm md:text-base text-center mb-8 max-w-2xl text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        Bridge the gap between brands seeking visibility and everyday social media users looking to monetize their influence. <span className="font-semibold">Earn $0.20 per engagement</span> or reach 30,000+ pieces posted for free without extra effort.
      </motion.p>

      {/* Stats Section */}
      <motion.div 
        className="flex flex-wrap justify-center gap-8 md:gap-16 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-black">3x</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Better Reach</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-orange-500">$0.20</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Per Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-green-600">30K+</div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Posts Reached</div>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <motion.button 
          className="py-3 px-8 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Earning Today
        </motion.button>
        <motion.button 
          className="py-3 px-8 bg-white text-black rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Launch Campaign
          <span className="text-xs">▼</span>
        </motion.button>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div 
        className="flex flex-wrap justify-center gap-8 mt-8 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Trusted Partnerships</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>24-Hour Turnaround</span>
        </div>
      </motion.div>
    </motion.div>
    </div>
  )
}

export default Hero
