# HotKey

HotKey is a simple Node.js module for registering global hotkeys (currently on OS X).

HotKey exposes an `EventEmitter` API (for `hotkeyDown`, `hotkeyUp` events).

NOTE: you have to specify at least a modifier for the hotkey to be effective.

## Example usage:

````JavaScript
var HotKey = require('hotkey');
 
var myHotkey = new HotKey('R', 'cmd+shift');

myHotkey.on('hotkeyPressed', function hotKeyPressed() {
    // do something...
});
````


## LICENSE

Hotkey is released under the [MIT license](http://en.wikipedia.org/wiki/MIT_License).
