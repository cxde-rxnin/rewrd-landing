import { motion } from 'framer-motion'

const Comparison = () => {
  return (
    <motion.div 
      className="w-full py-16 md:py-24 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mb-4">
            COMPARISON
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            3x Better Reach, Same Budget
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Traditional advertising vs PartnerPulse
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Traditional Social Ads */}
          <motion.div
            className="bg-white rounded-xl p-8 border border-gray-200"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ borderColor: "#ef4444" }}
          >
            <div className="mb-8">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Expensive</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Traditional Social Ads</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Campaign Budget</span>
                <span className="font-semibold text-gray-900">$50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Reach</span>
                <span className="font-semibold text-gray-900">10,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement Leads</span>
                <span className="font-semibold text-gray-900">150</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="text-3xl font-bold text-gray-900 mb-1">$0.006 - $0.012</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Cost per Engagement</div>
            </div>
          </motion.div>

          {/* PartnerPulse Campaign */}
          <motion.div
            className="bg-white rounded-xl p-8 border-2 border-purple-600"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ boxShadow: '0 8px 30px rgba(147, 51, 234, 0.12)' }}
          >
            <div className="mb-8">
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">Optimized</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">PartnerPulse Campaign</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Campaign Budget</span>
                <span className="font-semibold text-gray-900">$50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Reach</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">+200%</span>
                  <span className="font-semibold text-gray-900">30,000</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement Leads</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">+67%</span>
                  <span className="font-semibold text-gray-900">250</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">$0.002</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Cost per Engagement</div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Authentic Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">67%</div>
            <div className="text-sm text-gray-600">Cost Savings</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Comparison
