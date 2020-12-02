import React, { useEffect, useState } from 'react'

function Image({ img, contentType, alt}) {
  const [image, setImage] = useState('')

  const convert = (imageData, type) => {
    let base64Flag = ''
    if(type === '.png'){
      base64Flag = 'data:image/png;base64,'
    } else if(type === '.jpg'){
      base64Flag = 'data:image/jpg;base64,'
    } else if(type === '.jpeg'){
      base64Flag = 'data:image/jpeg;base64,'
    } else {
      console.error('Cannot proceed with that extension name!')
      return;
    }
    setImage(base64Flag + imageData)
  }

  useEffect(() => {
    
    convert(img, contentType)
  },[img, contentType])

  return (
    <div>
      <img src={image} alt={alt} />
    </div>
  )
}

export default Image
