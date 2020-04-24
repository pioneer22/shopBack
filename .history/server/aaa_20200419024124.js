let a = ['aa', 'bb', 'cc']
for (let index in a) {
  console.log(index)
}


let b = [
  {
    'a': 1,
    'b': 2,
    'c': 3
  }
]
for (let [index, elem] of new Map(b.map((item, i) => [i, item]))) {
  console.log(index, elem)
}