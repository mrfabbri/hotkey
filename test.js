var HotKey = require('./index');

var hotkey = new HotKey("E", "cmd+shift");

hotkey.on('hotkeyDown', function () {
    console.log('global hotkey pressed');
});

hotkey.on('hotkeyUp', function () {
    console.log('global hotkey released');
});
