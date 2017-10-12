function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  var arr = [...arr];
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;

  }
  return arr;
}

export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}