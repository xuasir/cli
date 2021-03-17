import React, { useState } from 'react'
import './app.scss'
import { text } from './app.module.scss'

export const App = () => {
  const [d] = useState(0)
  return (
    <>
      <div class={text}>{d}</div>
    </>
  )
}
