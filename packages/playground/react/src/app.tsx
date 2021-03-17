import React, { useState } from 'react'

export const App = () => {
  const [d] = useState(0)
  return (
    <>
      <div>{d}</div>
    </>
  )
}
