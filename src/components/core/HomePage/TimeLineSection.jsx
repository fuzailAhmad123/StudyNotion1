import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import TimeLineImage from "../../../assets/Images/TimelineImage.png"

const timeline = [
    {
         Logo:Logo1,
         heading:"Leadership",
         Description:"Fully commited to the success company"
    },
    {
        Logo:Logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority"
   },
   {
    Logo:Logo3,
    heading:"Flexibility",
    Description:"The ability to switch is an important skills"
   },
   {
    Logo:Logo4,
    heading:"Solve the problem",
    Description:"Code your way to a solution"
   } 
]
const TimeLineSection = () => {
  return (
    <div>
        <div className='flex flex-row gap-15 items-center'>

            <div className='flex flex-col w-[45%] gap-14 '>
                {
                    timeline.map((element , index) => {

                        return(
                            <div className='flex flex-row gap-5 relative'  key={index}>
                                   <div className='w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full'>
                                        <img src={element.Logo} alt="" />
                                   </div>

                                   <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                   </div>
                                   <div className='h-full border-2 border-l-richblack-100 border-dashed absolute left-0 translate-x-6 translate-y-12'></div>
                            </div>
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200 shadow-2xl'>
                <img src={TimeLineImage} alt="timelineimage" 
                className='shadow-white shadow-sm object-cover h-fit'/>

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
                                          left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                       <div className='flex gap-5 items-center border-r-[2px] border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-sm text-caribbeangreen-300'>Years of Experience</p>
                       </div>

                       <div className='flex gap-5 items-center  px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-sm text-caribbeangreen-300 '>Types of Courses</p>
                       </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default TimeLineSection