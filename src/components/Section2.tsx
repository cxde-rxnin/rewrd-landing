
import { motion } from 'framer-motion'

const steps = [
  {
    title: "Sign up",
    description: "Free and fast.",
    svg: (
      // SVG for "one"
      <img src="/one.svg" alt="" />
    ),
  },
  {
    title: "Complete tasks",
    description: "Like, follow, comment, or share.",
    svg: (
      <img src="/two.svg" alt="" />
    ),
  },
  {
    title: "Get paid",
    description: "Cash out anytime.",
    svg: (
      <img src="/three.svg" alt="" />
    ),
  },
];

const Section2 = () => {
  return (
    <motion.div 
      className="w-full text-center py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-black"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        How it works
      </motion.h2>
      
      <div className="flex flex-col md:flex-row justify-evenly items-center mt-8 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="p-6 flex flex-col items-center max-w-xs w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: idx * 0.2,
              ease: "easeOut" 
            }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div 
              className="mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: idx * 0.2 + 0.3,
                type: "spring",
                stiffness: 200 
              }}
            >
              {step.svg}
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.2 + 0.5 }}
            >
              {step.title}
            </motion.h3>
            <motion.p 
              className="text-black font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.2 + 0.6 }}
            >
              {step.description}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="px-8 py-3 text-white bg-black hover:bg-green-500 mb-10 mt-10 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05, backgroundColor: "#10b981" }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
};

export default Section2;
