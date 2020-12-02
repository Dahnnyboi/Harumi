import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from './Image'
import '../../stylesheets/partials/submitPost.scss'

function SubmitPost() {
  const [post, setPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState({})
  const profileImg = useSelector(state => state.auth.profileImg)
  const submitPost = (e) => {
    e.preventDefault()

    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }

    setIsSubmitting(true)
    fetch(`http://localhost:5000/api/posts?title=${post}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        setIsSubmitting(false)
        if(!response.ok){
          Promise.reject()
        }

        setResponse(json.post)
        setPost('')
      })
      .then(() => {
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="submits">
      <div className="profImg">
      {/* profile image */}
        <div className="image">
          <Image 
            img={profileImg.image}
            alt={profileImg.alt}
            contentType={profileImg.contentType}
          />
        </div>
      </div>
      <form onSubmit={submitPost}>
        <textarea value={post} onChange={(e) => { setPost(e.target.value) }} placeholder="What are your thoughts?"></textarea>
        <div className="helpers">
          {
            isSubmitting ?
              <p>Submitting...</p>
            : response.slug ?
              <p>Success posting</p>
              : <p></p>
          }
          <input type="submit" value="Post!"/>
        </div>
      </form>
    </div>
  )
}

export default SubmitPost
