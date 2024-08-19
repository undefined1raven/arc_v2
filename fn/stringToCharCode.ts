function stringToCharCodeArray(str: string): number[] {
  let stringActual = str;
  if (str === undefined) {
    throw new Error("stringToCharCodeArray: str is undefined");
  } else {
    if (typeof str !== "string") {
      stringActual = str.toString();
    }
  }
  const charCodeArray = [];
  for (let i = 0; i < stringActual.length; i++) {
    charCodeArray.push(stringActual.charCodeAt(i));
  }
  return charCodeArray;
}

export { stringToCharCodeArray };
