
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-3xl text-center py-10'>
        <Title text1={"ABOUT US"} text2={"FLOWERSHOP"} />
      </div>
      <div>
        <div className='my-5'>
          <div className='flex flex-row gap-5'>
            <img src={assets.imageabout} alt='' />
            <div className='flex flex-col justify-center gap-5'>
              <p className='text-xl'>FlowerShop is the leading reputable fresh flower shop in Vietnam.FlowerShop provides
                online flower ordering and delivery services nationwide.</p>
              <p className='text-xl'>With a system of affiliated stores spread
                across 63 provinces and cities in Vietnam, Flowercorner.vn fresh flower shop can help you easily send
                flowers to relatives, friends, and business partners anywhere. anytime.</p>
               <p>CONTACT INFORMATION</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About