import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from '../partials/Image'
import { changeInfo, changeProfile, removeResponse, removeImageResponse } from '../../redux'
import '../../stylesheets/partials/personal.scss'
import '../../stylesheets/partials/btn.scss'

function Personal() {
  const bioRedux = useSelector(state => state.auth.bio)
  const profileImgRedux = useSelector(state => state.auth.profileImg)
  const response = useSelector(state => state.auth.response)
  const changeResources = useSelector(state => state.auth.changeResources)
  const imageResponse = useSelector(state => state.auth.imageResponse)

  const dispatch = useDispatch()
  const [bio, setBio] = useState('')
  const [image, setImage] = useState({})
  const [valid, setValid] = useState('')
  const [newImage, setNewImage] = useState('')
  const photoRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeResponse())
      dispatch(removeImageResponse())
    }, 3000)
  },[response, imageResponse, dispatch])

  useEffect(() => {
    setImage(profileImgRedux)
    setBio(bioRedux)
  }, [bioRedux, profileImgRedux])

  const submitBio = () => {
    if(bio !== bioRedux){
      const creds = {
        bio
      }
      dispatch(changeInfo(creds))
    } else if(bio === bioRedux){
      setValid('Cannot submit same bio')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(changeProfile(photoRef.current))
  }

  const handleChange = (e) => {
    const file = e.target.files[0]

    const image = URL.createObjectURL(file);
    setNewImage(image)
  }

  return (
    <div className="personal">
      <h3>Personal</h3>
      <hr />

      {
        valid !== '' ? 
          <p className="valid">{valid}</p>
        : null
      }
      {
        !changeResources ? <p className="response">{response}</p> : <p>Loading...</p>
      }
      <div className="bio">
        <h5>Change your bio</h5>
        <textarea value={bio} onChange={(e) => { setBio(e.target.value) }} />
        <button className="button-white" onClick={() => { submitBio() }}>Change submit</button>
      </div>

      <hr />
      {!changeResources ? <p className="response">{imageResponse}</p> : <p>Loading...</p>}
      <div className="profile-image">
        <h5>Change profile image</h5>
        {
          newImage !== ''
            ? <div className="contain">
                <img src={newImage} alt={newImage} />
              </div>
            : 
            <div className="contain">
              <Image 
                img={image.image}
                alt={image.alt}
                contentType={image.contentType}
              />
            </div>
        }
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".jpg, .jpeg, .png" ref={photoRef} onChange={handleChange}/>
          <input className="button-white" type="submit" value="Change Submit" />
        </form>
      </div>
    </div>
  )
}

export default Personal
