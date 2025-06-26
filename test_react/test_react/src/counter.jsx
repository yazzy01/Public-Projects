import { useEffect, useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    const Increment = () => {
        setCount(count + 1);
    }

    const Decrement = () => {
        setCount(count - 1);
        if(count <= 0){
            setCount(0);
        }
    }

    const Reset = () => {
        setCount(0);
    }

    useEffect(()=>{
        console.log(count);
    },[Increment,Decrement,Reset]);

    


    return(
        <div>
            <p>{count}</p>
            <button onClick={Increment}>Increment</button>
            <button onClick={Reset}>Reset</button>
            <button onClick={Decrement}>Decrement</button>
        </div>
    )
}
export default Counter;


