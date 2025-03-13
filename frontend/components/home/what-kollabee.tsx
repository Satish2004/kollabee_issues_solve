import React from 'react'
import { OrbitingCircles } from '../magicui/orbiting-circles'
import { ChartColumnIncreasingIcon, Lightbulb, LucideClock, Star } from 'lucide-react'

function WhatKollabee() {
  return (
          <section className="mt-20 mx-auto px-4 z-50 max-w-7xl">
            <div className="text-center flex flex-col items-center mb-16">
              <div className="text-sm text-gray-900 mb-2 bg-gray-100 py-1 px-3 rounded-full w-fit mx-auto">What is KollaBee?</div>
              <h2 className="text-4xl mb-4 max-w-3xl">The first consumer goods manufacturing platform of its kind</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
               Find and manage suppliers in more than 600+ categories in the FMCG industry - private label or custom manufactoring 
              </p>
            </div>

            <div className='flex flex-row items-center justify-start'>
            <div className='relative flex h-[500px] w-[500px] flex-col items-center justify-center overflow-hidden'>
            <OrbitingCircles iconSize={80} radius={200} speed={0.2}>
            <div className='h-14 w-14 bg-neutral-600 rounded-full'></div>
            <div className='h-10 w-10 bg-teal-200 opacity-50 rounded-full flex flex-row justify-center items-center'><LucideClock className='w-5 h-5 text-teal-500' /></div>
            </OrbitingCircles>
            <OrbitingCircles iconSize={80} radius={140} reverse speed={0.1}>
            <div className='h-10 w-10 bg-neutral-600 rounded-full'></div>
            <div className='h-10 w-10 bg-amber-200 opacity-50 rounded-full flex flex-row justify-center items-center'><ChartColumnIncreasingIcon className='w-5 h-5 text-amber-600' /></div>
            </OrbitingCircles>
            <OrbitingCircles iconSize={80} radius={80} speed={0.3}>
            <div className='h-10 w-10 bg-neutral-600 rounded-full'></div>
            <div className='h-10 w-10 bg-blue-200 opacity-50 rounded-full flex flex-row justify-center items-center'><Lightbulb className='w-5 h-5 text-blue-700' /></div>
            </OrbitingCircles>

            <div className='h-24 max-w-3xl p-3 rounded-[8px] bg-white z-20 -translate-y-24 -translate-x-4 flex flex-col'>
                <div className='w-full flex flex-row items-center gap-4 justify-between'>
                    <div className='h-10 aspect-square bg-indigo-200 rounded-full'></div>
                    <div className='h-10 flex flex-col'>
                        <span className='text-sm font-medium text-green-500'>Task Done</span>
                        <div className='flex flex-row items-center'>
                        {
                            [1,2,3,4,5].map((i) => (
                                <Star key={i} className='w-3 h-3 text-yellow-500' fill='currentColor' />
                            ))
                        }
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-row gap-4 items-center justify-between'>
                <div className='h-10 flex flex-col'>
                        <span className=' font-semibold text-indigo-700'>Angeline</span>
                        <span className='text-xs font-medium text-neutral-400'>Member T2M Team</span>
                    </div>
                    <div className='bg-yellow-400 px-4 py-1  rounded-[5px] flex flex-row items-center justify-center'>
                        <span className='text-sm'>Message</span>
                    </div>

                </div>

            </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-4'>
            <h2 className="text-4xl max-w-3xl">Manage everything in one workspace</h2>
            <div className='h-1.5 w-[15%] bg-[#ea3d4f] rounded-full'></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
            At Marcos Designs, we craft beautiful, responsive websites that engage users and drive results. From sleek landing pages to complex web platforms, we blend creativity with functionality to bring your vision to life.
              </p>
            </div>

            </div>
          </section>
  )
}

export default WhatKollabee