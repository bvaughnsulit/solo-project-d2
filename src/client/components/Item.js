import React, { useEffect } from "react";

const Item = (props) => {
  const progressPercentage = (props.levelProgress / 1000) * 100
  let formattedDate;
  if (props.craftedDate !== undefined) {
    formattedDate = new Date(Number(props.craftedDate) * 1000).toString()
  }

  useEffect(props.getInstanceDetails, [])

  return (
    <div>
      <h3>{props.name}</h3>
      <strong>Date Crafted: </strong>{formattedDate}<br/>
      <strong>Level: </strong>{props.level || ''}<br/>
      <strong>Progress to next level: </strong> {progressPercentage || ''}%<br/>
      <img src={props.image} width='600px' />
    </div>)
}

export default Item;

