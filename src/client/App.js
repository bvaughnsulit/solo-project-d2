import React, { useEffect, useState } from "react";

const App = (props) => {
  const [foo, setFoo] = useState('foo')

  useEffect(() => {
    console.log('effect')
  },[foo])

  return (
    <div>
      <button onClick={() => { setFoo(`${foo}o`) }}>
      {foo}
      </button>
    </div>)
}

export default App;