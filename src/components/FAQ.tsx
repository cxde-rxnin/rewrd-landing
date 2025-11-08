import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const faqData = [
  {
    question: "How do I get paid?",
    answer:
      "You can withdraw your earnings directly to your account once you reach the minimum payout amount.",
  },
  {
    question: "What kind of tasks can I complete?",
    answer:
      "Tasks include liking posts, following accounts, commenting, or sharing content on popular social media platforms.",
  },
  {
    question: "Do I need social media accounts?",
    answer:
      "Yes! You’ll need active social media accounts to complete tasks and get rewarded.",
  },
  {
    question: "Is there a limit to how many tasks I can do?",
    answer:
      "Nope! The more tasks you complete, the more you earn.",
  },
  {
    question: "When will new tasks be available?",
    answer:
      "Tasks are added daily — just check your dashboard for new opportunities.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        FAQs
      </motion.h2>
      <div>
        {faqData.map((faq, idx) => (
          <motion.div 
            key={idx} 
            className="mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: idx * 0.1,
              ease: "easeOut" 
            }}
          >
            <motion.button
              className={`w-full text-left px-4 py-8 font-semibold bg-yellow-100 rounded-t focus:outline-none transition-colors ${
                openIndex === idx ? "bg-gray-200" : ""
              }`}
              onClick={() => toggle(idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
              whileHover={{ backgroundColor: "#fef3c7" }}
              whileTap={{ scale: 0.98 }}
            >
              {faq.question}
            </motion.button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  className="px-4 py-5 bg-gray-100/30 rounded-b mb-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {faq.answer}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
    );
  };
  export default FAQ;
