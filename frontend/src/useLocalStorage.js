import { useState, useEffect } from "react";

const useLocalStorage = (key, initVal = null) => {
    const value = localStorage.getItem(key) || initVal;
    const [item, setItem] = useState(value);
    useEffect(function setLocalStorage(){
        item === null ?
            localStorage.removeItem(key) :
            localStorage.setItem(key, item);
    }, [key, item]);
    return [item, setItem];
}

export default useLocalStorage;