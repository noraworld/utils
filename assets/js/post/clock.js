$(function() {

  'use strict';

  var hour;
  var minute;
  var second;
  var day;
  var month;
  var date;
  var year;
  const dayArr   = ['Sun', 'Mon', 'The', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  tick();

  function tick() {
    updateTime();
    showClock();
    showDate();
    var timer = setTimeout(tick, 200);
  }

  function updateTime() {
    hour   = new Date().getHours();
    minute = new Date().getMinutes();
    second = new Date().getSeconds();
    day    = dayArr[new Date().getDay()];
    month  = monthArr[new Date().getMonth()];
    date   = new Date().getDate();
    year   = new Date().getFullYear();
  }

  function showClock() {
    $('#clock').text(prepareFormat(hour) + ':' + prepareFormat(minute) + ':' + prepareFormat(second));
  }

  function showDate() {
    $('#date').text(day + ' ' + month + ' ' + date + ' ' + year);
  }

  function prepareFormat(str) {
    str = str.toString();
    str = ('0' + str).slice(-2);
    return str;
  }

});
