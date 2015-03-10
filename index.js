/**
 * Hotkey module.
 *
 * An EventMitter for Global Hotkeys.
 * 
 * Usage:
 * ````JavaScript
 * var HotKey = require('hotkey');
 * var myHotkey = new HotKey('R', 'cmd+shift');
 * myHotkey.on('hotkeyPressed', function hotKeyPressed() {
 *     // do something...
 * });
 * ````
 *
 * Events:
 * `"hotKeyPressed"` - triggered when keyboard shortcut is pressed
 * `"hotKeyReleased"` - triggered when keyboard shortcut is released
 * 
 */

"use strict";

var HotKeyNative = require('bindings')('hotkey').HotKey;
var EventEmitter = require("events").EventEmitter;
var util = require('util');

function getIntValueForModifiers(modifiers) {
  var result = 0; // 0 means no modifiers

  var bitMask = {
    "cmd"     : 1 << 8,
    "shift"   : 1 << 9,
    "option"  : 1 << 11,
    "control" : 1 << 12,
  }

  for (var modifier in bitMask) {
    if (~modifiers.indexOf(modifier)) {
      result |= bitMask[modifier];
    }
  }

  return result;
}

// TODO proper error handling
function getIntValueForLetter(letter) {
  return {
    "A" : 0x00,
    "S" : 0x01,
    "D" : 0x02,
    "F" : 0x03,
    "H" : 0x04,
    "G" : 0x05,
    "Z" : 0x06,
    "X" : 0x07,
    "C" : 0x08,
    "V" : 0x09,
    "B" : 0x0B,
    "Q" : 0x0C,
    "W" : 0x0D,
    "E" : 0x0E,
    "R" : 0x0F,
    "Y" : 0x10,
    "T" : 0x11,
    "1" : 0x12,
    "2" : 0x13,
    "3" : 0x14,
    "4" : 0x15,
    "6" : 0x16,
    "5" : 0x17,
    "9" : 0x19,
    "7" : 0x1A,
    "8" : 0x1C,
    "0" : 0x1D,
    "O" : 0x1F,
    "U" : 0x20,
    "I" : 0x22,
    "P" : 0x23,
    "L" : 0x25,
    "J" : 0x26,
    "K" : 0x28,
    "N" : 0x2D,
    "M" : 0x2E
  }[letter.toUpperCase()[0]] || 0;
}

/* 
 * TODO DOC
 */
function HotKey(letter, modifiers) {
  if (typeof letter === "undefined" || typeof modifiers === "undefined") {
    throw new Error("letter and modifiers arguments are required");
  }

  // TODO maybe the letter + modifier logic is better handled native side

  var hotkey = new HotKeyNative(getIntValueForLetter(letter), getIntValueForModifiers(modifiers));
  var self = this;
  hotkey.setCallback(function (event) { self.emit(event); });
}
util.inherits(HotKey, EventEmitter);

module.exports = HotKey;
