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

// TODO DOC
function getANSIVKForLetter(key) {
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
  }[key.toUpperCase()];
}

var hotkeys = {};

/**
 * A global hotkey.
 * `key` and `modifiers` options are mandatory, while `failed` callback is optional.
 *
 * @constructor
 * @param {Object} options
 */
function HotKey(options) {
  var key = options.key;
  var modifiers = options.modifiers;
  var failedCb;

  if (typeof key === "undefined" || typeof modifiers === "undefined") {
    throw new Error("key and modifiers are both required");
  }

  failedCb = (typeof options.failed === "function") ? options.failed : undefined;

  this.key = key;
  this.modifiers = modifiers;

  // TODO maybe the key + modifier logic is better handled native side

  try {
    this.id = hotkeyManager.registerHotkey(getANSIVKForLetter(key), getVKMaskForModifiers(modifiers));
    hotkeys[this.id] = this;
  } catch (err) {
    if (failedCb) { failedCb(err); }
  }
}

util.inherits(HotKey, EventEmitter);

// TODO DOC
HotKey.prototype.getKey = function getKey() { return this.key; }

// TODO DOC
HotKey.prototype.getModifiers = function getModifiers() { return this.modifiers; }

// TODO DOC
HotKey.prototype.toString = function toString() { return "[HotKey]" + this.key + "+" + this.modifiers; }

// TODO DOC
HotKey.prototype.unregister = function unregister() {
  // TODO better error
  try {
    hotkeyManager.unregisterHotkey(this.id);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}


hotkeyManager.setCallback(function (event, hotkeyID) {
  if (!hotkeys[hotkeyID]) {
    console.error("%d hotkeyID for global hotkey event %s not found", hotkeyID, event);
    return;
  }
  hotkeys[hotkeyID].emit(event);
});

module.exports = HotKey;
