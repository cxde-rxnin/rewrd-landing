
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer 
      className="text-black py-30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold">Rewrd</h2>
        </motion.div>
        <motion.div 
          className="flex justify-center gap-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a 
            href="/privacy" 
            className="hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy
          </motion.a>
          <motion.a 
            href="/terms" 
            className="hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Terms
          </motion.a>
          <motion.a 
            href="/contact" 
            className="hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.a>
        </motion.div>
        <motion.div 
          className="text-sm text-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>&copy; {new Date().getFullYear()} Rewrd. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
