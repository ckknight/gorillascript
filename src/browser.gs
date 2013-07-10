let GorillaScript = require './gorilla'
GorillaScript.require := require

if window?
  GorillaScript.load := #(url as String, callback as ->)
    let xhr = if window.ActiveXObject
      new window.ActiveXObject("Microsoft.XMLHTTP")
    else if window.XMLHttpRequest
      new window.XMLHttpRequest()
    else
      throw Error "Unable to create XMLHttpRequest"
    
    xhr.open "GET", url, true
    xhr.override-mime-type?("text/plain")
    xhr.onreadystatechange := #
      if xhr.ready-state == 4
        if xhr.status in [0, 200]
          (from-promise! GorillaScript.run xhr.response-text)(callback)
        else
          callback Error "Could not load $url"
    xhr.send null
  
  let run-scripts()
    let scripts = document.get-elements-by-tag-name "script"
    asyncfor next, script in scripts
      if script.type == "text/gorillascript"
        if script.src
          GorillaScript.load script.src, next
        else
          GorillaScript.run-sync script.inner-HTML
          next()
      else
        next()
  
  if window.add-event-listener
    add-event-listener "DOMContentLoaded", run-scripts, false
  else
    attach-event "onload", run-scripts
