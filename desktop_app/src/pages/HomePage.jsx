"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../config/routes"
import logoImage from "../assets/logo.jpg"

// Note:
// Make sure the font you're using supports all the variable properties. 
// React Bits does not take responsibility for the fonts used

const HomePage = () => {
  const navigate = useNavigate()

  const handleOpenFromLocal = () => {
    navigate(ROUTES.EDITOR + "?import=video")
  }

  const features = [
    {
      icon: "🎵",
      title: "Professional Audio Editing",
      description: "Advanced waveform editing with precision controls",
    },
    {
      icon: "🎙️",
      title: "Podcast Optimization",
      description: "AI-powered noise reduction and voice enhancement",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Real-time processing with zero-latency monitoring",
    },
    {
      icon: "🎯",
      title: "Perfect Results",
      description: "Professional-grade output for every project",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative">
  {/* Background Effects */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent pointer-events-none -z-10"></div>
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent pointer-events-none -z-10"></div>
  {/* ...re st of your content... */}

      {/* Background Effects */}
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-zinc-800 border border-zinc-700 rounded-2xl mb-6 overflow-hidden">
              <img 
                src={logoImage} 
                alt="Luna Audio Editor Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent leading-tight"
          >
    Luna - Your Podcast ,Perfected  Locally       
   </motion.h1>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl text-zinc-200 mb-8"
            >
        
            </motion.div>

          {/* Tagline */}
     

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The ultimate audio editing experience designed for creators who demand perfection
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(ROUTES.EDITOR)}
              className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-600 hover:border-zinc-500 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all duration-300 min-w-[200px]"
            >
              Start Creating ✨
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenFromLocal}
              className="bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-600 hover:border-zinc-500 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all duration-300 min-w-[200px]"
            >
              Import Files 📁
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-zinc-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-3 bg-zinc-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div> */}
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Why Choose Luna?
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Built for professionals, designed for everyone</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-900/20 to-black/20 backdrop-blur-sm border border-zinc-800 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Ready to Create?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust Luna for their audio editing needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(ROUTES.EDITOR)}
              className="bg-gradient-to-r from-gray-600 to-black hover:from-gray-500 hover:to-black text-white px-12 py-4 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300"
            >
              Get Started Now 🚀
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-zinc-500">© 2024 Luna Audio Editor. Crafted with ❤️ for creators.</p>
        </div>
      </footer>
    </div>

    </div>

  )
}

export default HomePage
