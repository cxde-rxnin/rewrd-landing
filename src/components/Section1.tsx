import { motion } from 'framer-motion'

const pathOptions = [
  {
    icon: '🎁',
    title: 'Brands',
    description: 'Amplify your brand with authentic and affordable social media engagement',
    features: [
      'Traditional social ads',
      'Flexible budget options',
      'Real-time analytics dashboard',
      'Targeted campaign setup'
    ],
    buttonText: 'Launch Your Campaign',
    color: 'purple'
  },
  {
    icon: '👤',
    title: 'Influencers',
    description: 'Expand reach and engagement by tapping into brand partnerships',
    features: [
      'Choose sponsored posts',
      'Curated campaign match',
      'Instant revenue payout',
      'Campaign performance stats'
    ],
    buttonText: 'View Deals',
    color: 'orange'
  },
  {
    icon: '👥',
    title: 'Participants',
    description: 'Make money from your social media account by earning per post',
    features: [
      'Like and share content',
      'Instant payment',
      'Leaderboard activities',
      'Get paid via any channel'
    ],
    buttonText: 'Join Now',
    color: 'green'
  }
]

const Section1 = () => {
  return (
    <motion.div 
      className="w-full py-16 md:py-24 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Choose Your Path to Success
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            PartnerPulse has something for everyone
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathOptions.map((option, idx) => (
            <motion.div
              key={idx}
              className="p-8 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}

            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {option.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-black mb-2">{option.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-6">{option.description}</p>

              {/* Features List */}
              <ul className="space-y-2 mb-8 grow">
                {option.features.map((feature, featureIdx) => (
                  <motion.li
                    key={featureIdx}
                    className="flex items-start gap-2 text-sm text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 + featureIdx * 0.1 }}
                  >
                    <span className="text-purple-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.buttonText}
                <span>→</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Section1
