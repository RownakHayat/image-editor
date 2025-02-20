import React from 'react'
import WebHeader from './WebHeader'
import Footer from './footer/footer'

const Weblayout = ({children}: any) => {
  return (
    <>
        <WebHeader />
        {children}
        <Footer />
    </>
  )
}

export default Weblayout