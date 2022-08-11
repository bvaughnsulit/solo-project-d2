import React, { useEffect, useState } from "react";
import Item from "./Item";

const InventoryContainer = (props) => {
  const [inventory, setInventory] = useState([])
  const items = [];

  useEffect(() => {
    fetch('/api')
      .then(res => {
        if (!res.ok) console.log(res.status)
        return res.json()
      })
      .then(json => {
        setInventory(json);
      })
      .catch(err => console.log(err))
  }, [])
  
  inventory.forEach(e => {
    console.log(e)
    items.push(
      <Item
        name={e.name}
        image={e.image}
        type={e.type}
        icon={e.icon}
        itemHash={e.itemHash}
        instanceId={e.itemInstanceId}
        key={e.itemInstanceId}
      />
    )
  })

  return (
    <div>
      {items}
    </div>)
}

export default InventoryContainer;



