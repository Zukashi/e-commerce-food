import React, { useState } from 'react'
import './main.css'

function Test(props: any){
    console.log(props)
    return <h2>123</h2>
}
function App() {
  const [count, setCount] = useState(0)

        return <h1 className='test'><h3 className='test-child'>
test
            <Test type={'1234'}>
            </Test>
        </h3></h1>
}

export default App
