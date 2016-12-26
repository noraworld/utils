$(function() {

  'use strict';

  console.info('Some thought you should use btoa() and atob() functions. But you should not say. That is just my interest.');

  // Submit encode form to exec encoding
  $('#encode').on('submit', function(event) {
    event.preventDefault();
    if ($('#plain-value').val() !== '') {
      var result = encode($('#plain-value').val());
      $('#result-value').val(result);
    }
  });

  // Submit decode form to exec decoding
  $('#decode').on('submit', function() {
    event.preventDefault();
    if ($('#encoded-value').val() !== '') {
      var result = decode($('#encoded-value').val());
      $('#result-value').val(result);
    }
  });

  // Submit result form to exec copy the result
  $('#result').on('submit', function() {
    event.preventDefault();
    if ($('#result-value').val() !== '') {
      $('#result-value').select();
      document.execCommand('copy');
      informCopied();
    }
  });

  // Click result form to select all characters
  $('#result-value').on('click', function() {
    $(this).select();
  });


  // Encode
  function encode(str) {
    var binary    = '';
    var binaryStr = '';
    var binaryArr = [];
    var base64Str = '';
    var base64Arr = [];
    var result    = '';
    var splitter;

    // For multi-byte code
    str = unescape(encodeURIComponent(str));

    // Translate original characters to binary
    for (var i = 0; i < str.length; i++) {
      binary = str[i].charCodeAt().toString(2);
      binaryStr += ('00000000' + binary).slice(-8);
    }

    // Split binary into every six characters
    splitter = new RegExp('.{1,' + 6 + '}', 'g');
    binaryArr = binaryStr.match(splitter);

    // Zero padding to last array index: e.g. '11' => '110000'
    binaryArr[binaryArr.length-1] = (binaryArr[binaryArr.length-1] + '000000').slice(0, 6);

    // Call convertBase64()
    for (var i = 0; i < binaryArr.length; i++) {
      base64Str += convertBase64(binaryArr[i]);
    }

    // Split base64 string into every four characters
    splitter = new RegExp('.{1,' + 4 + '}', 'g');
    base64Arr = base64Str.match(splitter);

    // Equal padding to last array index: e.g. 'Rw' => 'Rw=='
    base64Arr[base64Arr.length-1] = (base64Arr[base64Arr.length-1] + '====').slice(0, 4);

    // Join base64 array
    for (var i = 0; i < base64Arr.length; i++) {
      result += base64Arr[i];
    }

    return result;
  }


  // Decode
  function decode(str) {
    var result = '';
    var binaryStr = '';
    var splitter;
    var decimal;
    var binaryArr = [];

    // Delete equal characters
    // 'QUJDREVGRw==' => 'QUJDREVGRw'
    str = str.replace(/=/g, '');

    // Call convertBinary()
    // 'QUJDREVGRw' => '010000010100001001000011010001000100010101000110010001110000'
    for (var i = 0; i < str.length; i++) {
      binaryStr += convertBinary(str[i]);
    }

    // Split binary into every eight characters
    // '010000010100001001000011010001000100010101000110010001110000'
    // => ["01000001", "01000010", "01000011", "01000100", "01000101", "01000110", "01000111", "0000"]
    splitter = new RegExp('.{1,' + 8 + '}', 'g');
    binaryArr = binaryStr.match(splitter);

    // Convert binary to decimal and translate decoded characters
    // ["01000001", "01000010", "01000011", "01000100", "01000101", "01000110", "01000111"]
    // => 'ABCDEFG'
    for (var i = 0; i < binaryArr.length; i++) {
      decimal = parseInt(binaryArr[i], 2);
      result += String.fromCharCode(decimal);
    }

    // For multi-byte code
    try {
      result = decodeURIComponent(escape(result));
      if ($('#decode-form-group').hasClass('has-error') === true) {
        $('#decode-form-group').removeClass('has-error');
        $('#error-value').remove();
      }
    }
    catch (e) {
      console.error('You probably mistake decoded values...');
      if ($('#decode-form-group').hasClass('has-error') === false) {
        $('#decode-form-group').addClass('has-error');
        $('#encoded-value').after('<strong><span id="error-value" class="help-block">Error!</span></strong>');
      }
    }

    return result;
  }


  var message = false;
  var timerID;
  function informCopied() {
    if (message === false) {
      $('#copy').after('<strong><div id="copy-inform" class="text-center text-success" style="margin-top:10px;">Copied!</div></strong>');
      message = true;
    }
    else {
      $('#copy-inform').remove();
      clearTimeout(timerID);
      $('#copy').after('<strong><div id="copy-inform" class="text-center text-success" style="margin-top:10px;">Copied!</div></strong>');
    }
    timerID = setTimeout(function() {
      $('#copy-inform').remove();
      message = false;
    }, 1500);
  }


  // Translate binary to base64 character
  function convertBase64(binary) {
    switch (binary) {
      case '000000': return 'A';  //  0
      case '000001': return 'B';  //  1
      case '000010': return 'C';  //  2
      case '000011': return 'D';  //  3
      case '000100': return 'E';  //  4
      case '000101': return 'F';  //  5
      case '000110': return 'G';  //  6
      case '000111': return 'H';  //  7
      case '001000': return 'I';  //  8
      case '001001': return 'J';  //  9
      case '001010': return 'K';  // 10
      case '001011': return 'L';  // 11
      case '001100': return 'M';  // 12
      case '001101': return 'N';  // 13
      case '001110': return 'O';  // 14
      case '001111': return 'P';  // 15
      case '010000': return 'Q';  // 16
      case '010001': return 'R';  // 17
      case '010010': return 'S';  // 18
      case '010011': return 'T';  // 19
      case '010100': return 'U';  // 20
      case '010101': return 'V';  // 21
      case '010110': return 'W';  // 22
      case '010111': return 'X';  // 23
      case '011000': return 'Y';  // 24
      case '011001': return 'Z';  // 25
      case '011010': return 'a';  // 26
      case '011011': return 'b';  // 27
      case '011100': return 'c';  // 28
      case '011101': return 'd';  // 29
      case '011110': return 'e';  // 30
      case '011111': return 'f';  // 31
      case '100000': return 'g';  // 32
      case '100001': return 'h';  // 33
      case '100010': return 'i';  // 34
      case '100011': return 'j';  // 35
      case '100100': return 'k';  // 36
      case '100101': return 'l';  // 37
      case '100110': return 'm';  // 38
      case '100111': return 'n';  // 39
      case '101000': return 'o';  // 40
      case '101001': return 'p';  // 41
      case '101010': return 'q';  // 42
      case '101011': return 'r';  // 43
      case '101100': return 's';  // 44
      case '101101': return 't';  // 45
      case '101110': return 'u';  // 46
      case '101111': return 'v';  // 47
      case '110000': return 'w';  // 48
      case '110001': return 'x';  // 49
      case '110010': return 'y';  // 50
      case '110011': return 'z';  // 51
      case '110100': return '0';  // 52
      case '110101': return '1';  // 53
      case '110110': return '2';  // 54
      case '110111': return '3';  // 55
      case '111000': return '4';  // 56
      case '111001': return '5';  // 57
      case '111010': return '6';  // 58
      case '111011': return '7';  // 59
      case '111100': return '8';  // 60
      case '111101': return '9';  // 61
      case '111110': return '+';  // 62
      case '111111': return '/';  // 63
    }
  }


  // Translate base64 character to binary
  function convertBinary(base64char) {
    switch (base64char) {
      case 'A': return '000000';  //  0
      case 'B': return '000001';  //  1
      case 'C': return '000010';  //  2
      case 'D': return '000011';  //  3
      case 'E': return '000100';  //  4
      case 'F': return '000101';  //  5
      case 'G': return '000110';  //  6
      case 'H': return '000111';  //  7
      case 'I': return '001000';  //  8
      case 'J': return '001001';  //  9
      case 'K': return '001010';  // 10
      case 'L': return '001011';  // 11
      case 'M': return '001100';  // 12
      case 'N': return '001101';  // 13
      case 'O': return '001110';  // 14
      case 'P': return '001111';  // 15
      case 'Q': return '010000';  // 16
      case 'R': return '010001';  // 17
      case 'S': return '010010';  // 18
      case 'T': return '010011';  // 19
      case 'U': return '010100';  // 20
      case 'V': return '010101';  // 21
      case 'W': return '010110';  // 22
      case 'X': return '010111';  // 23
      case 'Y': return '011000';  // 24
      case 'Z': return '011001';  // 25
      case 'a': return '011010';  // 26
      case 'b': return '011011';  // 27
      case 'c': return '011100';  // 28
      case 'd': return '011101';  // 29
      case 'e': return '011110';  // 30
      case 'f': return '011111';  // 31
      case 'g': return '100000';  // 32
      case 'h': return '100001';  // 33
      case 'i': return '100010';  // 34
      case 'j': return '100011';  // 35
      case 'k': return '100100';  // 36
      case 'l': return '100101';  // 37
      case 'm': return '100110';  // 38
      case 'n': return '100111';  // 39
      case 'o': return '101000';  // 40
      case 'p': return '101001';  // 41
      case 'q': return '101010';  // 42
      case 'r': return '101011';  // 43
      case 's': return '101100';  // 44
      case 't': return '101101';  // 45
      case 'u': return '101110';  // 46
      case 'v': return '101111';  // 47
      case 'w': return '110000';  // 48
      case 'x': return '110001';  // 49
      case 'y': return '110010';  // 50
      case 'z': return '110011';  // 51
      case '0': return '110100';  // 52
      case '1': return '110101';  // 53
      case '2': return '110110';  // 54
      case '3': return '110111';  // 55
      case '4': return '111000';  // 56
      case '5': return '111001';  // 57
      case '6': return '111010';  // 58
      case '7': return '111011';  // 59
      case '8': return '111100';  // 60
      case '9': return '111101';  // 61
      case '+': return '111110';  // 62
      case '/': return '111111';  // 63
    }
  }

});
