import React from 'react';
const {useState} = React;
import axios from 'axios';
import { FaCheckCircle } from "react-icons/fa";


//TODO: review.photos
// Recommend checkmark

const ReviewsCard = ({review}) => {

  const options = {
    headers: {
      'Authorization': process.env.REACT_APP_API_KEY,
    }
  };

  const [ hasSetHelpfulness, setHasSetHelpfulness ] = useState(false)

  // console.log(review, 'review')

  const [reviewHelpful, setReviewHelpful] = useState(review.helpfulness);

  const date = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const dateItem = new Date(review.date);
  const formatDate = new Intl.DateTimeFormat('en-US',date);
  const finalDate = formatDate.format(dateItem);

  const handleYes = () => {
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/${review.review_id}/helpful`, null , options)
      .then(() => {
        console.log("Successfully updated helpfulness")
      })
      .then(()=> setHasSetHelpfulness(true))
      .catch((err) => {
        console.error("Error adding helpfulness count", err);
      })
  }

  return (
    <div className="rr-card">
      <div className="rr-stars-and-checks">
        <div className="Stars" style={{ '--rating': review.rating }}></div>
        <div className="rr-card-name">
          {review.recommend ? <FaCheckCircle /> : ""}
          <p>{review.reviewer_name}</p>
        </div>
      </div>

      <p className="rr-summary">{review.summary}</p>

      <p className="rr-body">{review.body}</p>

      <div className="rr-picture-thumbnails">
        {review.photos ? review.photos.map((photo, index) => {
          return <img key={index} className="rr-photo" src={photo.url}/>
        }) : ""}
      </div>

      {review.response ? <p className="rr-response">Response: {review.response}</p> : ""}
        <div className="rr-card-footer">
          <p>{finalDate}</p>
          {!hasSetHelpfulness ?
            <div> <div>Helpful?</div><span onClick={handleYes} className="yes-answer-button report-button">Yes</span> ({reviewHelpful})</div>
            : <div><span className="yes-answer-button report-button">Yes</span> ({reviewHelpful + 1})</div>}
        </div>
    </div>
  )
}

export default ReviewsCard