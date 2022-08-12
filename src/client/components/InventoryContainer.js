import React, { useEffect, useState } from "react";
import Item from "./Item";



const InventoryContainer = (props) => {
  const [inventory, setInventory] = useState({})
  const items = [];

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => {
        if (!res.ok) console.log(res.status)
        return res.json()
      })
      .then(json => {
        setInventory(json);
      })
      .catch(err => console.log(err))
  }, [])

  const getInstanceDetails = (instanceHash) => {
    fetch('/api/instanceDetails/' + instanceHash)
    .then(itemRes => {
      if (!itemRes.ok) console.log(itemRes.status)
      return itemRes.json()
    })
      .then(json => {  
        console.log('processing response...')
        const { perks, levelProgress, level, craftedDate } = json
        let updatedInstance = inventory[instanceHash]
        updatedInstance = {
          ...updatedInstance,
          perks,
          levelProgress,
          level,
          craftedDate
        }

        setInventory(prevState => ({
          ...prevState,
          [instanceHash]: updatedInstance
        }))
      })
  }
  
  Object.values(inventory)
    // yuck
    .sort((a, b) => {
      if (a.craftedDate && b.craftedDate) {
        return Number(b.craftedDate) - Number(a.craftedDate)
      } else {
        return Number(b.itemInstanceId) - Number(a.itemInstanceId)
      }
    })
    .forEach(e => {
    items.push(
      <Item
        name={e.name}
        image={e.image}
        type={e.type}
        icon={e.icon}
        itemHash={e.itemHash}
        instanceId={e.instanceId}
        key={e.itemInstanceId}
        id={e.itemInstanceId}
        perks={e.perks}
        levelProgress={e.levelProgress}
        level={e.level}
        craftedDate={e.craftedDate}
        getInstanceDetails={() => {
          getInstanceDetails(e.itemInstanceId)
        }}
      />
    )
  })

  return (
    <div>
      {items}
    </div>)
}

export default InventoryContainer;



