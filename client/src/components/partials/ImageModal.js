import React from 'react'
import { Link } from 'react-router-dom'

import Image from './Image'
import '../../stylesheets/partials/image_modal.scss'
import '../../stylesheets/partials/btn.scss'

function ImageModal({ img, isYourImage, bio, username, setOpen}) {
  return (
    <div className="image-modal">
      <div className="image-modal-container">
        <div className="image-container">
          <Image 
            img={img.image}
            contentType={img.contentType}
            alt={img.alt}
          />
        </div>
        
        <div className="infos">
          <div className="close">
            <h4>{username}</h4>
            <button className="button-darkest close" onClick={() =>{setOpen(false)}}>&times;</button>
          </div>
          <p>{bio}</p>
            {
              isYourImage ? <Link to={`/profile/${username}/settings/personal`} className="button-mid link">Change image</Link>
                : null
            }
        </div>
      </div>
      
    </div>
  )
}

export default ImageModal
