'use strict';
const log = function(msg) {
    console.log(new Date().toTimeString().split(' ')[0] + ' [Omniview] ' + msg);
}
module.exports = log;
