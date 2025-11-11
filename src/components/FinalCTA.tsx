import { motion } from 'framer-motion'

const FinalCTA = () => {
  return (
    <motion.div 
      className="w-full py-16 md:py-24 bg-purple-600 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1 bg-purple-700 text-white text-xs font-semibold rounded-full mb-6">
            🚀 JOIN PARTNERPULSE
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Social Advertising?
          </h2>

          {/* Subheading */}
          <p className="text-purple-100 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a brand looking to boost reach, or an influencer ready to monetize — PartnerPulse has the tools and community to make it happen.
          </p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button 
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-transparent text-white rounded-lg font-semibold border-2 border-white hover:bg-white hover:text-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Sales
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-12 text-purple-200 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Setup in 5 Minutes</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FinalCTA
