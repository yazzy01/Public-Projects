import React,{ useState } from 'react';



function Color() {
    const [color, setColor] = useState('');

    return (
        <>
        <h1>Color Challenge </h1>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
        </select>
        <p style={{color: color}}>Your Selected Color is : {color}</p>
        </>

    )
}
export default Color;