import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editPost } from '../../redux'

import '../../stylesheets/partials/modal_edit.scss'
import '../../stylesheets/partials/btn.scss'

function ModalEdit({ setEditingOpen, slug, index, titleInput }) {
  const [title, setTitle] = useState(titleInput)
  const dispatch = useDispatch()

  const editSubmit = (e) => {
    e.preventDefault()
    dispatch(editPost(slug, index, title))
  }

  return (
    <div className="edit-container">
      <div className="modal-edit">
        <div className="infos">
          <h4>{slug}</h4>
          <button className="button-darkest" onClick={() => { setEditingOpen() }}>&times;</button>
        </div>
        <form onSubmit={(e) => { editSubmit(e) }}>
          <textarea value={title} onChange={(e) => { setTitle(e.target.value) }}></textarea>
          <input className="button-darkest" type="submit" value="Edit" />
        </form>
      </div>
    </div>
  )
}

export default ModalEdit
