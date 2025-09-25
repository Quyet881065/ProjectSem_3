import LogoHome from '../components/home/LogoHome'
import LastCollection from '../components/home/LastCollection'
import BestSeller from '../components/home/BestSeller'
import OurPolicy from '../components/home/OurPolicy'
import NewsLetterBox from '../components/home/NewsLetterBox'


const Home = () => {
  return (
    <div>
      <LogoHome/>
      <LastCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLetterBox/>
    </div>
  )
}

export default Home