import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { changeInfo, removeResponse } from '../../redux'
import '../../stylesheets/partials/information.scss'
import '../../stylesheets/partials/btn.scss'

function Information() {
  const emailRedux = useSelector(state => state.auth.email)
  const response = useSelector(state => state.auth.response)
  const changeResources = useSelector(state => state.auth.changeResources)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [repeat, setRepeat] = useState('')
  const [valid, setValid] = useState('')

  useEffect(() => {
    setTimeout(() => {
      dispatch(removeResponse())
    }, 3000)
  },[response, dispatch])

  const submitEmail = (e) => {
    e.preventDefault()
    if(email !== '' && emailRedux !== email){
      const creds = {
        email
      }
      dispatch(changeInfo(creds))
      setEmail('')
    } else if(email === ''){
      setValid('Email cannot be blank')
    } else if(emailRedux === email){
      setValid('Email you submitted is the same')
    }
  }

  const submitPassword = () => {
    if(pass && repeat && pass === repeat){
      const creds = {
        password: pass
      }

      dispatch(changeInfo(creds))
      setPass('')
      setRepeat('')
    } else if(!pass){
      setValid('Password input cannot be blank')
    } else if(!repeat){
      setValid('Repeat password cannot be blank')
    } else if (pass !== repeat){
      setValid('Password and repeat password are not the same')
    }
  }

  return (
    <div className="information">
      <h2>Information</h2>
      <hr />
      { 
        valid !== '' ? <p className="valid">{ valid }</p> : null
      }
      {
        !changeResources ? <p className="response">{response}</p> : <p>Loading...</p>
      }
      <div className="email">
        <h4>Change your email</h4>
        <p>Current email : <i>{ emailRedux }</i></p>
        <form onSubmit={(e) => {submitEmail(e)}}>
          <input type="email" value={email} placeholder="Enter your new email" onChange={(e) => {setEmail(e.target.value)}} />
          <input type="submit" className="button-white" value="Submit change" />
        </form>
      </div>
      
      <hr />

      <div className="password">
        <h4>Change your password</h4>
        <input type="password" placeholder="Enter new password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
        <input type="password" placeholder="Repeat new password" value={repeat} onChange={(e) => { setRepeat(e.target.value)}} />
        <button onClick={() => { submitPassword() }} className="button-white">Submit Change</button>
      </div>
    </div>
  )
}

export default Information
