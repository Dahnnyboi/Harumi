import React, { useState } from 'react'

import edit from '../../res/edit.svg'
import trash from '../../res/trash.svg'
import Image from './Image'
import ModalDelete from './ModalDelete'
import ModalEdit from './ModalEdit'
import '../../stylesheets/partials/btn.scss'

import '../../stylesheets/partials/posts.scss'

function Posts({ slug, author, img, title, date, isYourPost, index }) {
  const [editOpen, setEditOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  const setDeleteOpen = () => { setDelOpen(!delOpen) }
  const setEditingOpen = () => { setEditOpen(!editOpen) }

  return (
    <div className="post-container">
      <div className="container">
        <div className="image-container">
          <div className="prof-img">
            <Image 
              img={img.image}
              alt={img.alt}
              contentType={img.contentType}
            />
          </div>
        </div>
        <div className="user-info">
          <div className="infos">
            <h4>{author}</h4>
            <p className="date">{date ? date.slice(0, 10) : null}</p>
          </div>
          {
            isYourPost ?
            <div className="inputs">
              <button className="button-mid" onClick={() => { setDeleteOpen()}}>
                <img src={trash} alt="trash" />
              </button>
              <button className="button-mid" onClick={() => { setEditingOpen() }} >
                <img src={edit} alt="alt" />
              </button>
            </div>
            : null
          }
          
        </div>
      </div>
      <div className="post-title">
        {
          title.length < 36 ? 
            <p className="big">{title}</p>
            : <p className="small">{title}</p>
        }
      </div>

      {
        delOpen ?
          <ModalDelete 
            setDeleteOpen={setDeleteOpen}
            slug={slug}
          />
        : null
      }

      {
        editOpen ?
          <ModalEdit 
            setEditingOpen={setEditingOpen}
            slug={slug}
            index={index}
            titleInput={title}
          />
        : null
      }

    </div>
  )
}

export default Posts
