function pallindrome(string){
    const reversed = string.split("").reverse().join("");
    return reversed === string;
}

console.log(pallindrome("apapa"))