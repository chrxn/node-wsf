'use strict';



var Parser = module.exports = function Parser() {
  return this;
};

// The parser emits events!


Parser.prototype.date = function(body) {
  // console.log(data);
  var text = body;
  console.log('text', text);
  var re = /"\\\/Date\((\d*-\d*)\)\\\/"/g,
      replacer = function (m) {
        return parseInt(m.match(/\d*-\d*/)[0]);
      };
  console.log('poop',text.replace(re, replacer));
  return text.replace(re, replacer);
};
