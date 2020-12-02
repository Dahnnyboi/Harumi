import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SignStyle from '../stylesheets/signup.module.scss'

function SignupPage() {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')

  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [response, setResponse] = useState({})

  useEffect(() => {

  },[response, loading])

  const onSubmit = (e) => {
    e.preventDefault()
    let regex = /\d/g;
    const validPass =  regex.test(pass);
    const containsSpec = isValidString(pass)
    const isPassLength = pass.length >= 8

    const usercreds = {
      username: user,
      email: email,
      password: pass
    }

    if(user && email && pass && pass2 && pass === pass2 && isPassLength &&validPass && !containsSpec){
      console.log("valid")
      setIsValid(true)

      const usercredentials = {
        user: usercreds
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(usercredentials) 
      }

      setLoading(true)
      // post the user to the database
      fetch('http://localhost:5000/api/users/signup', config)
        .then(response => { 
          return response.json().then(json => ({ json, response}))
        })
        .then(({json, response}) => {
          setLoading(false)
          if(!response.ok){
            setValid('Failed to request signup')
            setResponse(json)
          } else {
            console.log("Success signup")
            setResponse(json)
          }
        }).catch(err => console.log(err))
    } else if(!user) {
      setValid('User cannot be blank')
    } else if(!email){
      setValid('Email cannot be blank')
    } else if(!validPass){
      setValid('Password should contain numbers')
    } else if(pass !== pass2){
      setValid('Password inputs are not the same')
    } else if(isPassLength){
      setValid('Password should be 8 letters long or more')
    }else if(!pass){
      setValid('Password cannot be blank')
    } else if(containsSpec){
      setValid('Password should not contain special character')
    } else {
      console.log("invalid")
    }
  }

  const setValid = (msg) => {
    setResponse({ errors: { message: msg } })
    setIsValid(false)
  }

  const isValidString = (string) => {
    const format = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]+/;

    if(format.test(string)){
      return true;
    } else {
      return false;
    }
  }
  return (
    <div className={`${SignStyle.signBody}`}>
      <div className={`${SignStyle.content}`}>
        <h2>Create your user</h2>
        {
          isValid ? 
          (<p></p>)
          :
          (<p className={`${SignStyle.error}`}>{response.errors.message}</p>)
        }
        {
          loading ?
            (<p className={`${SignStyle.center}`}>Processing your signup request...</p>)
            : 
              response.message ? <p className={`${SignStyle.success}`}>{response.message}</p> 
              :
              <form onSubmit={onSubmit}>
                <input type="text" placeholder="username" value={user} onChange={(e) => { setUser(e.target.value)}} />
                <input type="email" placeholder="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                <input type="password" placeholder="password" value={pass} onChange={(e) => {setPass(e.target.value)}} />
                <input type="password" placeholder="check password" value={pass2} onChange={(e) => {setPass2(e.target.value)}} />

                <input type="submit" value="Signup" />
              </form>
        }
        <Link to="/">
          Login
        </Link>
      </div>
    </div>
  )
}

export default SignupPage
