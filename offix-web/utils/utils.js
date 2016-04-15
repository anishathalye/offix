var utils = module.exports = {};

utils.constantTimeStringEquals = function(a, b) {
  if (typeof(a) === 'undefined' || typeof(b) === 'undefined') {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  var equal = true;
  for (var length = a.length, i = 0; i < length; i++) {
    equal &= (a.charAt(i) === b.charAt(i));
  }
  return equal;
};
