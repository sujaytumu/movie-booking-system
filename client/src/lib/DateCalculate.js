const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const fullDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase().replace(/ /, ''); 

  return `${day}, ${fullDate} • ${time}`;
};

export default formatDateTime;
 