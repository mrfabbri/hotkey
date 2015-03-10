
var should = require("chai").should();
var HotKey = require('./index');

describe('HotKey', function () {
  var hotkey;

  afterEach(function (done) {
    hotkey.unregister();
    done();
  });

  describe('#new', function () {

    it('should create and register a new hotkey', function (done) {
      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      hotkey.should.be.a('object');
      hotkey.getKey().should.equal('E');
      hotkey.getModifiers().should.equal('cmd+shift');

      hotkey.on('hotkeyPressed', function () {
        console.log('global hotkey pressed');
      });

      hotkey.on('hotkeyReleased', function () {
        console.log('global hotkey released');
      });

      done();
    });

    // TODO fix test
    // it('should fail to register the same hotkey twice', function (done) {
    //   hotKey = new HotKey({ key: "E", modifiers: "cmd+shift" });
    //   var sameHotkey = new HotKey({
    //       key: "E",
    //       modifiers: "cmd+shift",
    //       failed: function (err) {
    //         done();
    //       }
    //     });
    // });
  });

  describe('#unregister', function () {

    it('should unregister an hotkey and register again', function (done) {
      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      hotkey.unregister();

      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      hotkey.should.be.a('object');
      hotkey.getKey().should.equal('E');
      hotkey.getModifiers().should.equal('cmd+shift');

      done();
    });
  });
});

// TODO test with send key emulation
