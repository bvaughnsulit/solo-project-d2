import React, { useEffect, useState } from "react";

const App = (props) => {
  const [foo, setFoo] = useState('foo')

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(json => console.log(json.foo))
      .catch(err => console.log(err))
  },[foo])

  return (
    <div>
      <button onClick={() => { setFoo(`${foo}o`) }}>
      {foo}
      </button>
    </div>)
}

export default App;