import React, { useEffect, useRef, useState } from 'react'

type CountDownProps = {
  className?: string
  seconds: number
  callback?: (...args: any[]) => void
}

const formatTime = (time: number) => {
  let minutes = Math.floor(time / 60)
  let seconds = Math.floor(time - minutes * 60)

  // @ts-ignore
  if (minutes < 10) minutes = '0' + minutes
  // @ts-ignore
  if (seconds < 10) seconds = '0' + seconds

  return minutes + ':' + seconds
}

export default function CountDown({ className, seconds, callback }: CountDownProps) {
  const [countDown, setCountDown] = useState(seconds)
  const timerId = useRef<any>()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCountDown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timerId.current)
  }, [])

  useEffect(() => {
    if (countDown <= 0) {
      clearInterval(timerId.current)

      if (callback) {
        callback()
      }
    }
  }, [countDown])

  return <span className={className}>{formatTime(countDown)}</span>
}
