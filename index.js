/*
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

var hotkeyManager = require('bindings')('globalHotkeyManager');
var EventEmitter = require("events").EventEmitter;
var util = require('util');

function getVKMaskForModifiers(modifiers) {
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
function getANSIVKForLetter(letter) {
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

var hotkeys = {};

// TODO DOC
function HotKey(letter, modifiers) {
  var hotkeyID;
  var _letter;
  var _modifiers;

  _letter = letter;
  _modifiers = modifiers;

  this._letter = letter;
  this._modifier = modifiers;

  if (typeof letter === "undefined" || typeof modifiers === "undefined") {
    throw new Error("letter and modifiers arguments are required");
  }

  // TODO maybe the letter + modifier logic is better handled native side

  hotkeyID = hotkeyManager.registerHotkey(getANSIVKForLetter(letter), getVKMaskForModifiers(modifiers));
  hotkeys[hotkeyID] = this;
}
util.inherits(HotKey, EventEmitter);
HotKey.prototype.getLetter = function getLetter() { return this._letter; }
HotKey.prototype.getModifiers = function getModifiers() { return this._modifiers; }
HotKey.prototype.toString = function toString() { return this.letter + this._modifiers; }


hotkeyManager.setCallback(function (event, hotkeyID) {
  if (!hotkeys[hotkeyID]) {
    console.error("%d hotkeyID for global hotkey event %s not found", hotkeyID, event);
    return;
  }
  hotkeys[hotkeyID].emit(event);
});

module.exports = HotKey;
