export const getTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12;
  return `${hour}:${minutes.toString().length === 1 ? `0${minutes}` : minutes} ${ampm}`;
};
