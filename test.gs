console.log "This is a test!"

for item in [\a, \b, \c]
  if item == \c
    throw Error("oh noes!")
