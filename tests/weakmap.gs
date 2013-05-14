test "normal use", #
  let wm = WeakMap()
  let obj = {}
  eq void, wm.get obj
  eq false, wm.has obj
  wm.set obj, "hello"
  eq "hello", wm.get obj
  eq true, wm.has obj
  wm.set obj, "there"
  eq "there", wm.get obj
  eq true, wm.has obj
  wm.delete obj
  eq void, wm.get obj
  eq false, wm.has obj

let has-frozen = is-function! Object.freeze and is-function! Object.is-frozen and Object.is-frozen(Object.freeze({}))

test "frozen key", #
  unless has-frozen
    return
  let wm = WeakMap()
  let obj = Object.freeze {}
  eq void, wm.get obj
  eq false, wm.has obj
  wm.set obj, "hello"
  eq "hello", wm.get obj
  eq true, wm.has obj
  wm.set obj, "there"
  eq "there", wm.get obj
  eq true, wm.has obj
  wm.delete obj
  eq void, wm.get obj
  eq false, wm.has obj

test "freeze key while in WeakMap", #
  unless has-frozen
    return
  let wm = WeakMap()
  let obj = {}
  eq void, wm.get obj
  eq false, wm.has obj
  wm.set obj, "hello"
  eq "hello", wm.get obj
  eq true, wm.has obj
  Object.freeze obj
  eq "hello", wm.get obj
  eq true, wm.has obj
  wm.set obj, "there"
  eq "there", wm.get obj
  eq true, wm.has obj
  wm.delete obj
  eq void, wm.get obj
  eq false, wm.has obj
