'use strict'

const TIMEOUT_DELAY = 100
var timeoutID = null

function show(startUnixTime, sessionHours, sessionMinutes, sessionSeconds) {
  let sessionTime = sessionHours * 3600 + sessionMinutes * 60 + sessionSeconds
  let elapsedTime = getCurrentUnixTime() - startUnixTime
  let leftTimeHours = ('00' + Math.floor((sessionTime - elapsedTime) / 3600)).slice(-2)
  let leftTimeMinutes = ('00' + Math.floor((sessionTime - elapsedTime) / 60) % 60).slice(-2)
  let leftTimeSeconds = ('00' + (sessionTime - elapsedTime) % 60).slice(-2)

  document.querySelector('#timer').textContent = `${leftTimeHours}:${leftTimeMinutes}:${leftTimeSeconds}`

  if (sessionTime - elapsedTime > 0) {
    timeoutID = setTimeout(show, TIMEOUT_DELAY, startUnixTime, sessionHours, sessionMinutes, sessionSeconds)
  }
  else {
    if (document.querySelector('#sound-power').checked) {
      playSound()
    }

    if (document.querySelector('#auto-start').checked) {
      if (validate()) {
        timeoutID = setTimeout(
          show,
          TIMEOUT_DELAY,
          getCurrentUnixTime(),
          Number(document.querySelector('#hours').value),
          Number(document.querySelector('#minutes').value),
          Number(document.querySelector('#seconds').value)
        )
      }
    }
    else {
      document.querySelector('#stop').classList.add('d-none')
      document.querySelector('#start').classList.remove('d-none')
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

  let hours = document.querySelector('#hours')
  let minutes = document.querySelector('#minutes')
  let seconds = document.querySelector('#seconds')

  let hoursRegex = /^([0-9]|[0-9][0-9])$/
  let minutesRegex = /^([0-9]|[0-5][0-9])$/
  let secondsRegex = /^([0-9]|[0-5][0-9])$/

  if (hoursRegex.test(hours.value)) {
    hours.classList.remove('is-invalid')
  }
  else {
    hours.classList.add('is-invalid')
    isValid = false
  }

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
  let startButton = document.querySelector('#start')
  let stopButton = document.querySelector('#stop')
  let resumeButton = document.querySelector('#resume')
  let resetButton = document.querySelector('#reset')

  startButton.addEventListener('click', () => {
    if (validate()) {
      startButton.classList.add('d-none')
      stopButton.classList.remove('d-none')

      clearTimeout(timeoutID)

      show(
        getCurrentUnixTime(),
        Number(document.querySelector('#hours').value),
        Number(document.querySelector('#minutes').value),
        Number(document.querySelector('#seconds').value)
      )
    }
  })

  stopButton.addEventListener('click', () => {
    stopButton.classList.add('d-none')
    resumeButton.classList.remove('d-none')

    clearTimeout(timeoutID)
  })

  resumeButton.addEventListener('click', () => {
    if (validate()) {
      resumeButton.classList.add('d-none')
      stopButton.classList.remove('d-none')

      clearTimeout(timeoutID)

      show(
        getCurrentUnixTime(),
        Number(document.querySelector('#timer').textContent.split(':')[0]),
        Number(document.querySelector('#timer').textContent.split(':')[1]),
        Number(document.querySelector('#timer').textContent.split(':')[2])
      )
    }
  })

  resetButton.addEventListener('click', () => {
    stopButton.classList.add('d-none')
    resumeButton.classList.add('d-none')
    startButton.classList.remove('d-none')

    clearTimeout(timeoutID)

    document.querySelector('#timer').textContent = '00:00:00'
  })
}())
