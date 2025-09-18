const thousandConvert = (num) => {
    if (num % 1000 !== 0) {
        return (num / 1000).toFixed(1) + 'k';
    } else if (num % 1000 === 0) {
        return (num / 1000) + 'k';
    }
    else {
        return num;
    }
}

export default thousandConvert;