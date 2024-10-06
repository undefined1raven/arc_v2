 function itemTextToLabel(item: string) {
    const split = item.split(" ");
    return split[0] + ", " + split[2] + " " + split[1];
  }


  export {itemTextToLabel}