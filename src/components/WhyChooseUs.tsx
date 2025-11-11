import { motion } from 'framer-motion'
import { BentoGrid, BentoGridItem } from './ui/BentoGrid'

const benefits = [
  {
    icon: '👥',
    title: 'Targeted Engagement',
    description: 'Connect with the right audience demographics and psychographics with our precision targeting.',
    className: 'md:col-span- p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-purple-100 to-purple-200"></div>
    ),
  },
  {
    icon: '⚡',
    title: 'Cost Efficient',
    description: 'Launch campaigns that cost less and deliver better results with our optimized pricing.',
    className: 'md:col-span-1 p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-orange-100 to-yellow-200"></div>
    ),
  },
  {
    icon: '🎯',
    title: 'Authentic Targeting',
    description: 'Reach real users who genuinely care about your brand, no bots or fake accounts.',
    className: 'md:col-span-1 p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-green-100 to-emerald-200"></div>
    ),
  },
  {
    icon: '💰',
    title: 'Cash Rewards',
    description: 'Participants earn real money for every successful engagement with no hidden fees.',
    className: 'md:col-span-1 p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-pink-100 to-rose-200"></div>
    ),
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    description: 'Track your campaign performance with detailed insights and adjust strategies on the fly.',
    className: 'md:col-span-2 p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-blue-100 to-indigo-200"></div>
    ),
  },
  {
    icon: '🔒',
    title: 'Privacy by Design',
    description: 'We take data security seriously. Your info is encrypted and never shared with third parties.',
    className: 'md:col-span-3 p-4',
    header: (
      <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-linear-to-br from-gray-100 to-slate-200"></div>
    ),
  }
]

const WhyChooseUs = () => {
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
            Why Brands Choose PartnerPulse
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            We combine authenticity, affordability, and analytics into one seamless advertising experience
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {benefits.map((benefit, idx) => (
              <BentoGridItem
                key={idx}
                title={benefit.title}
                description={benefit.description}
                header={benefit.header}
                className={benefit.className}
                icon={
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl mb-2">
                    {benefit.icon}
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WhyChooseUs
