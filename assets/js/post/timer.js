'use strict'

const TIMEOUT_DELAY = 100
const COOKIE_PATH = '/utils'
var timeoutID = null
var isInterval = false

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
      let soundElement = isInterval ? '#start-sound' : '#end-sound'
      playSound(soundElement)
    }

    toggleIntervalState()

    if (document.querySelector('#auto-start').checked) {
      if (validate()) {
        if (document.querySelector('#interval').checked && isInterval) {
          clearTimeout(timeoutID)

          timeoutID = setTimeout(
            show,
            TIMEOUT_DELAY,
            getCurrentUnixTime(),
            Number(document.querySelector('#interval-hours').value),
            Number(document.querySelector('#interval-minutes').value),
            Number(document.querySelector('#interval-seconds').value)
          )
        }
        else {
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

function playSound(element) {
  document.querySelector(element).currentTime = 0
  document.querySelector(element).play()
}

function toggleIntervalState() {
  if (document.querySelector('#interval').checked) {
    isInterval = !isInterval
  }
  else {
    isInterval = false
  }

  if (isInterval) {
    document.querySelector('#timer').classList.add('text-success')
  }
  else {
    document.querySelector('#timer').classList.remove('text-success')
  }
}

function validate() {
  let isValid = true

  let hours = document.querySelector('#hours')
  let minutes = document.querySelector('#minutes')
  let seconds = document.querySelector('#seconds')

  let intervalHours = document.querySelector('#interval-hours')
  let intervalMinutes = document.querySelector('#interval-minutes')
  let intervalSeconds = document.querySelector('#interval-seconds')

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

  if (hoursRegex.test(intervalHours.value)) {
    intervalHours.classList.remove('is-invalid')
  }
  else {
    intervalHours.classList.add('is-invalid')
    isValid = false
  }

  if (minutesRegex.test(minutes.value)) {
    minutes.classList.remove('is-invalid')
  }
  else {
    minutes.classList.add('is-invalid')
    isValid = false
  }

  if (minutesRegex.test(intervalMinutes.value)) {
    intervalMinutes.classList.remove('is-invalid')
  }
  else {
    intervalMinutes.classList.add('is-invalid')
    isValid = false
  }

  if (secondsRegex.test(seconds.value)) {
    seconds.classList.remove('is-invalid')
  }
  else {
    seconds.classList.add('is-invalid')
    isValid = false
  }

  if (secondsRegex.test(intervalSeconds.value)) {
    intervalSeconds.classList.remove('is-invalid')
  }
  else {
    intervalSeconds.classList.add('is-invalid')
    isValid = false
  }

  return isValid
}

function intervalChecked() {
  let interval = document.querySelector('#interval')
  let intervalInput = document.querySelector('#interval-input')

  if (interval.checked) {
    intervalInput.classList.remove('d-none')
  }
  else {
    intervalInput.classList.add('d-none')
  }

  interval.addEventListener('change', () => {
    if (interval.checked) {
      intervalInput.classList.remove('d-none')
    }
    else {
      intervalInput.classList.add('d-none')
    }
  })
}

function restore(inputElements, checkboxElements) {
  for (let element of inputElements) {
    let restoredValue = getCookie(element)
    if (restoredValue) document.querySelector(`#${element}`).value = restoredValue
  }

  for (let element of checkboxElements) {
    let restoredValue = getCookie(element)
    if (restoredValue) {
      document.querySelector(`#${element}`).checked = restoredValue === 'true' ? true : false
    }
  }
}

function save(inputElements, checkboxElements) {
  for (let element of inputElements) {
    document.querySelector(`#${element}`).addEventListener('keyup', function() {
      document.cookie = `${this.id}=${this.value}; path=${COOKIE_PATH};`
    })
  }

  for (let element of checkboxElements) {
    document.querySelector(`#${element}`).addEventListener('change', function() {
      console.log(this.checked)
      document.cookie = `${this.id}=${this.checked}; path=${COOKIE_PATH};`
    })
  }
}

function getCookie(name) {
  for (let cookie of document.cookie.split(';')) {
    let key = cookie.trim().split('=')[0]
    let value = cookie.trim().split('=')[1]

    if (key === name) return value
  }

  return null
}

(function() {
  let inputElements = [
    'hours',
    'minutes',
    'seconds',
    'interval-hours',
    'interval-minutes',
    'interval-seconds'
  ]
  let checkboxElements = [
    'interval',
    'auto-start',
    'sound-power'
  ]
  restore(inputElements, checkboxElements)
  save(inputElements, checkboxElements)

  intervalChecked()

  let startButton = document.querySelector('#start')
  let stopButton = document.querySelector('#stop')
  let resumeButton = document.querySelector('#resume')
  let resetButton = document.querySelector('#reset')

  startButton.addEventListener('click', () => {
    if (validate()) {
      startButton.classList.add('d-none')
      stopButton.classList.remove('d-none')

      clearTimeout(timeoutID)

      if (document.querySelector('#interval').checked && isInterval) {
        show(
          getCurrentUnixTime(),
          Number(document.querySelector('#interval-hours').value),
          Number(document.querySelector('#interval-minutes').value),
          Number(document.querySelector('#interval-seconds').value)
        )
      }
      else {
        show(
          getCurrentUnixTime(),
          Number(document.querySelector('#hours').value),
          Number(document.querySelector('#minutes').value),
          Number(document.querySelector('#seconds').value)
        )
      }
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

    isInterval = false
    document.querySelector('#timer').classList.remove('text-success')
  })
}())
