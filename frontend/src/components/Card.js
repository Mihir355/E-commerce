import React from "react";
import "../styling/card.css";

const Card = ({ imageUrl, text }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt="Card image" className="card-image" />
      <p>{text}</p>
    </div>
  );
};

export default Card;
