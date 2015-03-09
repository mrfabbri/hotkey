var HotKey = require('./index');

var hotkey = new HotKey("E", "cmd+shift");

hotkey.on('hotkeyPressed', function () {
    console.log('global hotkey pressed');
});

hotkey.on('hotkeyReleased', function () {
    console.log('global hotkey released');
});

setTimeout(function () {
    console.log('You have 10 seconds to press E+cmd+shift ');
}, 10*1000);