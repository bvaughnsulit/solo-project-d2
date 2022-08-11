import React from "react";

const Item = (props) => {

  return (
    <div>
      <h3>{props.name}</h3>
      <img src={props.image} width='600px'/>
    </div>)
}

export default Item;