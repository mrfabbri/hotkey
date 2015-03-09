# HotKey

HotKey is a simple Node.js module for registering global hotkeys (currently on OS X).

HotKey exposes an `EventEmitter` API (for `hotkeyDown`, `hotkeyUp` events).


## Example usage:

````JavaScript
var HotKey = require('hotkey');
 
var myHotkey = new HotKey('R', 'cmd+shift');

myHotkey.on('hotkeyDown', function hotKeyPressed() {
    // do something...
});
````


## LICENSE

Hotkey is released under the [MIT license](http://en.wikipedia.org/wiki/MIT_License).
