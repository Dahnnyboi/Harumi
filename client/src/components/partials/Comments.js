import React from 'react'
import Image from './Image'
import { useDispatch } from 'react-redux'

import { deleteComment } from '../../redux'
import '../../stylesheets/partials/comments.scss'
import '../../stylesheets/partials/btn.scss'
import trash from '../../res/trash.svg'

function Comments({ postSlug, postIndex, commentIndex, commentId, img, username, title, date, isYourComment }) {
  const dispatch = useDispatch()
  const delComment = () => {
    console.log('deleted!')
    dispatch(deleteComment(postSlug, postIndex, commentIndex, commentId))
  }

  return (
    <div className="comments-container">
      <div className="infos">
        <div className="image-container">
          <div className="prof-img">
            <Image
              img={img.image}
              contentType={img.contentType}
              alt={img.alt}
            />
          </div>
        </div>
        
        <div className="author-info">
          <div className="info">
            <h4>{username}</h4>
            <p>{date ? date.slice(0, 10) : date}</p>
          </div>
          {
            isYourComment ?
            <div className="inputs">
              <button onClick={() => { delComment() }}className="button-darkest">
                <img src={trash} alt="trash" />
              </button>
            </div>
            : null
          }
        </div>
      </div>
      

      <div>
        <p>{title}</p>
      </div>
    </div>
  )
}

export default Comments
