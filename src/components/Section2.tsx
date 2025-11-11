
import { motion } from 'framer-motion'
import { Timeline } from './ui/Timeline'

const steps = [
  {
    title: "Create Campaign",
    badge: "VERIFIED",
    description: "Set up your campaign with our strategic management, covering budget, location, and target audience.",
    icon: "📱",
    color: "purple"
  },
  {
    title: "Influencer Distribution",
    badge: "VERIFIED",
    description: "We find and share influencer content and their contact info on Facebook, Instagram, LinkedIn, X, and TikTok.",
    icon: "📢",
    color: "purple"
  },
  {
    title: "Verified Engagement",
    badge: "RECOMMENDED",
    description: "Participants share and boost your engagement — influencers can do $0.20 per verified activity with data they're happy to share.",
    icon: "✓",
    color: "green"
  },
  {
    title: "Real-Time Analytics",
    badge: "OPTIMIZED",
    description: "Monitor your campaigns with real-time analytics. Control advertising movements, engagement ratio, and KPIs through our UI.",
    icon: "📊",
    color: "orange"
  }
]

const Section2 = () => {
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            How PartnerPulse Works
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            From strategy to reality, we handle it all with our streamlined four-step advertising process
          </p>
        </motion.div>

        {/* Timeline */}
        <Timeline data={steps} />
      </div>
    </motion.div>
  );
};

export default Section2;
