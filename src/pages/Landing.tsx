import Header from '../components/Header'
import Hero from '../components/Hero'
import Section1 from '../components/Section1'
import Section2 from '../components/Section2'
import Comparison from '../components/Comparison'
import InfluencerCategories from '../components/InfluencerCategories'
import WhyChooseUs from '../components/WhyChooseUs'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Section1 />
      <Section2 />
      <Comparison />
      <InfluencerCategories />
      <WhyChooseUs />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default Landing
