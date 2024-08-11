function displayTimeFromMsDuration(duration: number): string {
  //refactor this to return the elepsed time in this format: hh:mm:ss, should hide the hours if its not past one hour
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  return `${hours > 0 ? `${hours < 10 ? "0" + hours : hours}:` : ""}${
    remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes
  }:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
}

export { displayTimeFromMsDuration };
