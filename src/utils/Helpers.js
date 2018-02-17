'use strict';

String.prototype.leftPad = function(padString, length) {
  let str = this;
  while (str.length < length)
    str = padString + str;

  return str;
}