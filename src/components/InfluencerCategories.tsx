import { motion } from 'framer-motion'

const categories = [
  {
    icon: '⭐',
    title: 'Nano Influencer',
    followers: '1K - 10K',
    earningRange: '$0.15 - $0.20',
    color: 'purple',
    image: '/nano.jpg',
  },
  {
    icon: '🌟',
    title: 'Micro Influencer',
    followers: '10K - 100K',
    earningRange: '$0.25 - $0.50',
    color: 'pink',
    image: 'micro.jpg',
  },
  {
    icon: '✨',
    title: 'Macro Influencer',
    followers: '100K - 1M',
    earningRange: '$0.50 - $5.00',
    color: 'yellow',
    image: '/macro.jpg',
  }
]

const InfluencerCategories = () => {
  return (
    <motion.div 
      className="w-full py-16 md:py-24 bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-4">
            CATEGORIES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Influencer Categories
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            We've designed a tier system that rewards everyone based on their reach and engagement levels — because every voice matters!
          </p>
        </motion.div>

        {/* Apple-style Cards */}
        <div className="flex gap-6 overflow-x-auto py-10 md:py-20 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] px-4">
          {categories.map((category, idx) => (
            <motion.div
              key={idx}
              className="shrink-0 w-80 md:w-96 h-[500px] md:h-[600px] rounded-3xl overflow-hidden relative snap-center group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/70" />
              
              {/* Icon at Top Left */}
              <div className="absolute top-8 left-8 w-14 h-14 flex items-center justify-center text-3xl">
                {category.icon}
              </div>
              
              {/* Content at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.3 }}
                >
                  {/* Followers Badge */}
                  <div className="inline-flex items-center gap-2 py-1 rounded-full mb-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm text-white font-medium">{category.followers}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {category.title}
                  </h3>
                  
                  {/* Earning Range */}
                  <div className="rounded-2xl">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {category.earningRange}
                    </div>
                    <div className="text-sm text-white/80">Earning Range per Post</div>
                  </div>
                </motion.div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-linear-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default InfluencerCategories
