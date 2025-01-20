import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center '>

      <div className="flex w-full justify-center items-center">
          <img src="banner.gif" alt="LOL LOL LOL LOL" className="pointer-events-none w-[70rem] " />
      </div>

      <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold'>Your Shortcut to Smart Links! 👇</h2>
      <form className="sm:h-14 flex flex-col  sm:flex-row w-full md:w-2/4 gap-2">
        <Input type="url" placeholder="Enter the looong URL" className="rounded h-full flex-1 py-4 px-4" />
        <Button className="rounded h-full" type="submit" variant="destructive">Shorten!</Button>
      </form>

      {/* <div className="flex w-full justify-center items-center">
      <img src="banner.gif" alt="LOL LOL LOL LOL" className="pointer-events-none w-[70rem] " />
      </div> */}

    </div>
  )
}

export default LandingPage