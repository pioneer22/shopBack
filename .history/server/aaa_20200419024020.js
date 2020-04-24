let a = ['aa','bb','cc']
for(let index in a){
  console.log(index)
}

for(let [index,elem] of new Map(a.map((item,i)=>[i,item]))){
  console.log(index,elem)
}