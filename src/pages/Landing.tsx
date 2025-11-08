import Header from '../components/Header'
import Hero from '../components/Hero'
import Section1 from '../components/Section1'
import Section2 from '../components/Section2'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

const Landing = () => {
  return (
    <div>
      <div
        className="min-h-screen w-full bg-yellow-50 md:bg-top md:bg-cover md:bg-no-repeat overflow-hidden bg-mobile-hidden"
        style={{ 
          backgroundImage: "url('/bg-asset.svg')",
          backgroundSize: "110%",
          backgroundPosition: "center -70px"
        }}
      >
        <Header />
        <Hero />
        <Section1 />
        <Section2 />
        <FAQ />
        <Footer />
      </div>
    </div>
  )
}

export default Landing
