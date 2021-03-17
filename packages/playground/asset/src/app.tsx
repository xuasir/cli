import React, { useState } from 'react'
import umi from './static/umi.png'

export const App = () => {
  const [d] = useState(0)
  return (
    <>
      <div>{d}</div>
      <img src={umi} />
    </>
  )
}
