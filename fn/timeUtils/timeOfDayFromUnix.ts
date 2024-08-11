function timeOfDayFromUnix(unixTime: number): string {
  const date = new Date(unixTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}
export { timeOfDayFromUnix };
