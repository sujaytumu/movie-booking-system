const timeCalculate = (time) => {
    const hour = Math.floor(time/60);
    if(time%60 !== 0) {
    const minutes = time%60;
    return `${hour} hr ${minutes} mins`
    } else {
       return `${hour} hr` 
    }
}

export default timeCalculate;