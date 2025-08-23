import DashboardSection from "../component/home/DashboardSection"
import ExchangeSection from "../component/home/ExchangeSection"
import HeroSection from "../component/home/HeroSection"
import PromoSection from "../component/home/PromoSection"
import WalletSetupSection from "../component/home/WalletSetupSection"


const Home = () => {
  return (
    <div>
      <HeroSection />
      <PromoSection/>
      <ExchangeSection/>
      <WalletSetupSection/>
      <DashboardSection/>
    </div>
  )
}

export default Home
