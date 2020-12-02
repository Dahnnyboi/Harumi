import React from 'react'
import { useDispatch } from 'react-redux'

import heartfilled from '../../res/heart-1.svg'
import heartunfilled from '../../res/heart-2.svg'
import '../../stylesheets/partials/favorites.scss'
import '../../stylesheets/partials/btn.scss'

import { postFavorite, postUnfavorite } from '../../redux'

function Favorites({ count, isFavorited, slug, index }) {
  const dispatch = useDispatch()

  const updateFavorite = () => {
    if(isFavorited){
      dispatch(postUnfavorite(slug, index))
    } else if(!isFavorited){
      dispatch(postFavorite(slug, index))
    }
  }

  return (
    <div className="favorites-container">
      <h4>{count} Favorites</h4>
      <div className="inputs">
        <button className="button-darkest" onClick={() => {updateFavorite()}}>
          {
            isFavorited ?
            <img src={heartfilled} alt="heart-filled" />
            : <img src={heartunfilled} alt="heart-unfilled" />
          }
        </button>
      </div>
    </div>
  )
}

export default Favorites
