$(function() {

  $('#encode').on('submit', function(event) {
    event.preventDefault();
    var result = encode($('#source').val());
    $('#result').val(result);
  });

  $('#result').on('click', function() {
    $(this).select();
  });

  $('#copy').on('click', function() {
    $('#result').select();
    document.execCommand('copy');
  });

  function encode(str) {
    var result = '';
    var num;
    var r;
    for (var i = 0; i < str.length; i++) {
      num = str[i].charCodeAt().toString(2);
      result += ('00000000' + num).slice(-8);
    }
    r = new RegExp('.{1,' + 6 + '}', 'g');
    result = result.match(r);
    result[result.length-1] = (result[result.length-1] + '000000').slice(6);
    console.log(result);
    return result;
  }

});
