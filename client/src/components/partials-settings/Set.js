import React from 'react'
import { useParams } from 'react-router-dom'
import Personal from './Personal'
import Information from './Information'

function Set() {
  const { set } = useParams()
  return (
    <div>
      {
        set === 'info' ?
          <Information />
        : <Personal />
      }
    </div>
  )
}

export default Set
