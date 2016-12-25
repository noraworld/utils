$(function() {

  // Submit form to exec encoding
  $('#encode').on('submit', function(event) {
    event.preventDefault();
    var result = encode($('#source').val());
    $('#result').val(result);
  });

  // Click result form to select all characters
  $('#result').on('click', function() {
    $(this).select();
  });

  // Click copy button to copy the result
  $('#copy').on('click', function() {
    $('#result').select();
    document.execCommand('copy');
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

    // Split binary into every four characters
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

});
