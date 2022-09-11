'use strict'

const TIMEOUT_DELAY = 200
var timeoutID = null

function show(startUnixTime, sessionMinutes, sessionSeconds) {
  let sessionTime = sessionMinutes * 60 + sessionSeconds
  let elapsedTime = getCurrentUnixTime() - startUnixTime
  let leftTimeMinutes = ('00' + Math.floor((sessionTime - elapsedTime) / 60)).slice(-2)
  let leftTimeSeconds = ('00' + (sessionTime - elapsedTime) % 60).slice(-2)

  document.querySelector('#timer').textContent = `${leftTimeMinutes}:${leftTimeSeconds}`

  if (sessionTime - elapsedTime > 0) {
    timeoutID = setTimeout(show, TIMEOUT_DELAY, startUnixTime, sessionMinutes, sessionSeconds)
  }
  else {
    if (document.querySelector('#sound-power').checked) {
      playSound()
    }

    if (document.querySelector('#auto-start').checked) {
      timeoutID = setTimeout(show, TIMEOUT_DELAY, getCurrentUnixTime(), sessionMinutes, sessionSeconds)
    }
  }
}

function getCurrentUnixTime() {
  return Math.floor(Date.now() / 1000)
}

function playSound() {
  document.querySelector('#sound').currentTime = 0
  document.querySelector('#sound').play()
}

function validate() {
  let isValid = true

  let minutes = document.querySelector('#minutes')
  let seconds = document.querySelector('#seconds')

  let minutesRegex = /^[0-9]+$/
  let secondsRegex = /^([0-9]|[0-5][0-9])$/

  if (minutesRegex.test(minutes.value)) {
    minutes.classList.remove('is-invalid')
  }
  else {
    minutes.classList.add('is-invalid')
    isValid = false
  }

  if (secondsRegex.test(seconds.value)) {
    seconds.classList.remove('is-invalid')
  }
  else {
    seconds.classList.add('is-invalid')
    isValid = false
  }

  return isValid
}

(function() {
  document.querySelector('#start').addEventListener('click', () => {
    clearTimeout(timeoutID)

    if (validate()) {
      show(
        getCurrentUnixTime(),
        Number(document.querySelector('#minutes').value),
        Number(document.querySelector('#seconds').value)
      )
    }
  })
}())
