import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchComments, advanceCommentPage, postComment } from '../../redux'
import Comments from './Comments'

import '../../stylesheets/partials/btn.scss'
import '../../stylesheets/partials/list_comments.scss'

function ListComments({ slug, index, comments, pageLimit, currentPage, commentsCount}) {
  const [commentInput, setCommentInput] = useState('')
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const advancePage = () => {
    // dispatch to advance the page
    dispatch(fetchComments(slug, currentPage, index))
    dispatch(advanceCommentPage(index))
    console.log(pageLimit, currentPage)
  }

  const submitComment = () => {
    dispatch(postComment(commentInput, slug, index))
    setCommentInput('')
  }

  return (
    <div className="list-comments-container">
      {
        comments.map((co, idx) => {
          return <Comments
            postSlug={slug}
            postIndex={index}

            commentIndex={idx}
            commentId={co.id}
            img={co.author.profileImg}
            username={co.author.username}
            title={co.comment}
            date={co.createdAt}
            isYourComment={co.isYourComment}
          />
        })
      }
      {
        pageLimit > currentPage  ? <div onClick={() => {
          setOpen(true)
          advancePage()
        }}>
          {
            !open ? <div className="view-comments">
              <hr />
              <h4>Comments</h4>
              <p>{commentsCount} comments</p>
            </div> :<h4>View more comments..</h4>
          }
        </div>
        : null
      }
      {
        open ? 
        <div className="comments-input">
          <textarea value={commentInput} placeholder="Add your comment" onChange={(e) => { setCommentInput(e.target.value) }}/>
          <button className="button-mid" onClick={() => { submitComment() }}>Submit</button>
        </div>
        : null
      }
    </div>
  )
}

export default ListComments
