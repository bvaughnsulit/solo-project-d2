import React, { useEffect } from "react";

const Item = (props) => {
  let progressPercentage = '0%';
  if (props.levelProgress !== undefined) {
    progressPercentage = ((props.levelProgress / 1000) * 100).toFixed(0).toString() + '%'
  }
  let formattedDate;
  if (props.craftedDate !== undefined) {
    formattedDate = new Date(Number(props.craftedDate) * 1000).toLocaleDateString()
  }

  useEffect(props.getInstanceDetails, [])

  return (
    <div className="item-card" id={props.id}>
      <div className="image">
        <img src={props.image} width='600px' />
      </div>
      <div className="item-info">
        <h3>{props.name}</h3>
        <div className="level">
        <strong>Level: {props.level || ''}</strong><br />
        </div>
        <strong>Progress to next level: </strong> {progressPercentage}<br/>
        <strong>Date Crafted: </strong>{formattedDate}<br/>
      </div>
      
    </div>)
}

export default Item;

