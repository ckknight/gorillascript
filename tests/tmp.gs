let iterator-to-array(iterator, values = [])
  values.reverse()
  values.push void
  let arr = []
  while true
    let item = if iterator.send
      iterator.send values.pop()
    else
      iterator.next()
    if item.done
      return arr
    arr.push item.value

let order-list()
  let list = []
  let f(value)
    list.push value
    value
  f.list := list
  f

//
test "yield* iterator", #
  let range(start, finish)*
    for i in start til finish
      yield i

  let fun()*
    yield 0
    yield* range(1, 10)
    yield 10

  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array fun()
