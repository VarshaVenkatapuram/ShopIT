import React from 'react'
import StarRatings from "react-star-ratings";

const ListReviews = ({reviews}) => {
  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews?.map((review)=>(
<div className="review-card my-3">
        <div className="row">
          <div className="col-1">
            <img
              src={review?.user?.avatar ?
                review?.user?.avatar?.url :"/images/default_avatar.jpg"
              }
              alt="User Name"
              width="50"
              height="50"
              className="rounded-circle"
            />
          </div>
          <div className="col-11">
            <div className="star-ratings">
              <StarRatings
              rating={review?.rating}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="24px"
              starSpacing="1px"
            />
            </div>
            <p className="review_user">by {review?.user?.name}</p>
            <p className="review_comment">{review?.comment}</p>
          </div>
        </div>
        <hr />
      </div>
      ))}
      
      
    </div>
  )
}

export default ListReviews