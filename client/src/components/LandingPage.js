import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import LandingStyle from '../stylesheets/landing.module.scss'
import '../stylesheets/partials/btn.scss'
import { login } from '../redux'

function LandingPage({ login, errMsg, authFetching }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [query, setQuery] = useState({})

  useEffect(() => {
    
  },[query])

  const onSubmit = (e) => {
    e.preventDefault()

    const user ={
      email: email,
      password: pass
    }

    setQuery(user)
    login(user)
  }

  return (
    <div className={`${LandingStyle.landingBody}`}>
      <div className={`${LandingStyle.darkPart}`}>
        <h2>harumi</h2>
        <h4>Explore the world!</h4>
      </div>
      <div className={`${LandingStyle.lightPart}`}>
        { authFetching ? <p className={`${LandingStyle.processing}`}>Processing request login</p> : 
          <form onSubmit={onSubmit} >
            <h3>Follow your idols!</h3>
            {
              errMsg ? (<p className={`${LandingStyle.errMsg}`}>{errMsg}</p>) : null
            }
            <input type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" />
            <input type="password" value={pass} onChange={(e) => {setPass(e.target.value)}} placeholder="Password" />
            <input type="submit" value="LOGIN" />
          </form>
        }

          <Link to="/signup">
            Signup
          </Link>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    errMsg: state.auth.errMsg,
    authFetching: state.auth.authFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    login: (usercreds) => { dispatch(login(usercreds))}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage)
