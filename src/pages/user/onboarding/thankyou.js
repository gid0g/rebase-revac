import React from 'react'
import Logo from "../../../assets/images/Logo.png"
import { Link } from 'react-router-dom'

const ThankYou = () => {
  return (
    <section className='flex flex-col justify-center items-center h-screen gap-8'>
      <div className='flex flex-col justify-center items-center gap-3'>
        <img src={Logo} alt="revbill" className='w-[50%] md:w-[30%] object-cover h-auto'/>
        <h4 className='text-blue-900 text-xl md:text-2xl lg:text-4xl font-semibold'>Thanks for Signing Up!</h4>
      </div>

      <div className='flex flex-col justify-center items-center lg:justify-start lg:items-start gap-2'>
        <p className='text-gray-800 text-center lg:text-start'>Thanks for signing up to Revbill.</p>
        <p className='text-gray-800 text-center lg:text-start'>Your request for Onboarding is currently undergoing for processing</p>
        <p className='text-gray-800 text-center lg:text-start'>If you have any questions, feel free to <Link to={""} className='text-blue-900'>email our customer service team.</Link></p>

        <div className='w-full flex flex-col justify-center items-center mt-6'>
          <Link to={"/"} className='bg-blue-900 rounded-md py-3 px-5 text-white no-underline font-medium'>Go back Home</Link>
        </div>
      </div>
    </section>
  )
}

export default ThankYou