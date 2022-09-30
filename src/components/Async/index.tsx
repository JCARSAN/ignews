import { useEffect, useState } from 'react';

export function Async() {
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsButtonVisible(true)
        }, 1000)
    }, [])

    return(
        <div>
            <p>Hello World</p>
            { isButtonVisible && <button>Button</button>}
        </div>
    )
}