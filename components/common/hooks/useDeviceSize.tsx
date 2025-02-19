import { useEffect, useState } from "react"

function useDeviceSize() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setScreenSize(getCurrentDimension())
  }, [typeof window === "undefined"])

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension())
    }
    window.addEventListener("resize", updateDimension)

    return () => {
      window.removeEventListener("resize", updateDimension)
    }
  }, [screenSize])

  return [screenSize]
}

export default useDeviceSize
