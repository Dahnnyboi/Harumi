import React from 'react'
import { useDispatch } from 'react-redux'
import { fetchDeletePost } from '../../redux'

import '../../stylesheets/partials/btn.scss'
import '../../stylesheets/partials/modal_delete.scss'

function ModalDelete({ setDeleteOpen, slug }) {
  const dispatch = useDispatch()
  
  const dispatchDeletePost = () => {
    dispatch(fetchDeletePost(slug))
    setDeleteOpen()
  }

  return (
    <div className="delete-container">
      <div className="modal-delete">
        <h4>Are you sure you want to delete this post?</h4>
        <p>{slug}</p>
        <div classname="inputs">
          <button className="button-darkest btn" onClick={() => { dispatchDeletePost() }}>delete</button>
          <button className="button-black btn" onClick={() => { setDeleteOpen() }}>cancel</button>
        </div>
      </div>
    </div>
    
  )
}

export default ModalDelete
