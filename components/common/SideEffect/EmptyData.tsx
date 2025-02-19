import React from 'react'
import Image from 'next/image'

type Props = {}

const EmptyData = (props: Props) => {
  return (
    <>
      <div className="h-[calc(100vh-50vh)]">
        <div className="h-full w-full flex flex-col justify-center">
          {/* <div className="mx-auto h-[300px] w-[300px]">
            <Image
              src={"/assets/icons/emptyBox.gif"}
              width={300}
              height={300}
              alt="Empty data"
              style={{
                width: "100%",
                height: "100%"
              }}
              className="mx-auto"
            />
          </div> */}
          <p className='text-3xl font-bold text-center pt-5'>No Data Found!</p>
        </div>
      </div>
    </>
  )
}

export default EmptyData
