import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { requestUser } from '../../redux'


import Image from '../partials/Image'
import settings from '../../res/settings-4.svg'
import '../../stylesheets/partials/btn.scss'
import profileStyle from '../../stylesheets/profile.module.scss'
import ImageModal from '../partials/ImageModal'


function UserInfo({ requestUser, uname, username, bio, isLoading, profileImg, followersCount, isYourProfile }) {
  const [openImage, setOpenImage] = useState(false)

  const setOpen = (state) => {
    setOpenImage(state)
  }
  useEffect(() => {
    requestUser(uname)
  },[requestUser, uname])

  return (
    <div className={`${profileStyle.userInfo}`}>
      {
        isLoading ? 
          <div className={`${profileStyle.loadingUser}`}>
            <h4>Loading</h4>
          </div>
          :
          <div className={`${profileStyle.showUser}`}>
            <div className={`${profileStyle.image}`} onClick={() => { setOpen(true) }}>
              <Image
                img={profileImg.image}
                alt={profileImg.alt}
                contentType={profileImg.contentType}
              />
            </div>
            
            <h2 className={`${profileStyle.username}`}>@{username}</h2>
            <h4 className={`${profileStyle.followersCount}`}>{followersCount} followers</h4>
            <div className={`${profileStyle.bioContainer}`}>
              <h4>bio</h4>
              {
                isYourProfile ?
                  bio === '' ?
                    <Link to={`/profile/${username}/settings/personal`}>Add a bio</Link>
                    : <p>{bio}</p>
                  : <p>No bio</p>
              }
            </div>
            {
              isYourProfile ?
                <div className={`${profileStyle.settings}`}>
                  <img src={settings} alt="settings"/>
                  <Link to={{
                    pathname: `/profile/${username}/settings/info`,
                    state: { username: username }
                  }}>Settings</Link>
                </div>
                : null
            }
          </div>
        }
        {
          openImage ? 
            <ImageModal 
              img={profileImg}
              isYourImage={isYourProfile}
              bio={bio}
              username={username}
              setOpen={setOpen}
            />
          : null
        }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.profile.username,
    bio: state.profile.bio,
    isLoading: state.profile.isLoading,
    profileImg: state.profile.profileImg,
    followersCount: state.profile.followersCount,
    isYourProfile: state.profile.isYourProfile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestUser: (username) => { dispatch(requestUser(username)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)
