const timeFormat = (time) => {
     const date = new Date(time);
     const localtime = date.toLocaleTimeString('en-IN', {
        hour : '2-digit',
        minute: '2-digit',
        hour12 : true
     });
     return localtime;
}

export default timeFormat;