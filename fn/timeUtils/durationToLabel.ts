function durationToLabel(duration: number): string {
  if (duration < 60) {
    return "<1 min";
  } else {
    const minutes = Math.floor(duration / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = Math.floor(duration % 60);
    if (hours === 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${minutes % 60}m`;
    }
  }
}

export { durationToLabel };
