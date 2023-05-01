import React, { useState } from 'react';

export default function HomePage() { 
    const [counter, setCounter] = useState(0);
    return (<>
        <p>Counter: {counter}</p>
        <button onClick={() => {setCounter((curr) => curr+1)}}>click me</button>
    </>);    
}

