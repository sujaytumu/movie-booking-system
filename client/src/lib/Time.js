const time = (time) => {
    const hour = Math.floor(time/60);
    const minutes = String(time%60).padStart('0','2');

    if(hour<2) {
        return `${hour} hour ${minutes} minutes`
    } else {
        return `${hour} hours ${minutes} minutes`
    }
}

export default time;