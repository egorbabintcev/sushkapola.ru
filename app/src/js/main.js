window.$ = require('jquery');
require('../libs/plugins/jquery.lazyloadxt');
require('../libs/plugins/jquery.lazyloadxt.bg');
require('./lazy');

$(function() {
  require('./navigation.js');
  require('./geolocation');
})
