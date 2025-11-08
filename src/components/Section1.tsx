import { motion } from 'framer-motion'

const Section1 = () => {
  return (
    <motion.div 
      className="w-11/12 md:w-8/12 mx-auto py-20 flex flex-col items-center md:h-11/12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.img
        src="https://via.placeholder.com/600x300?text=Dashboard+Image"
        alt="Dashboard placeholder"
        style={{ width: '100%', height: '350px', borderRadius: '8px', background: '#eee' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      />
    </motion.div>
  )
}

export default Section1
