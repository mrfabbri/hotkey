
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

    it('should register different hotkeys', function () {
      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift" });
      hotkey.should.be.a('object');
      hotkey.getKey().should.equal('E');
      hotkey.getModifiers().should.equal('cmd+shift');

      var hotkey2 = new HotKey({ key: "E", modifiers: "cmd" });
      hotkey2.should.be.a('object');
      hotkey2.getKey().should.equal('E');
      hotkey2.getModifiers().should.equal('cmd');

      var hotkey3 = new HotKey({ key: "L", modifiers: "option" });
      hotkey3.should.be.a('object');
      hotkey3.getKey().should.equal('L');
      hotkey3.getModifiers().should.equal('option');
    });

    it('should fail to register the same hotkey twice', function (done) {
      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift" });
      var sameHotkey = new HotKey({
          key: "E",
          modifiers: "cmd+shift",
          failed: function (err) {
            done();
          }
        });
    });
  });

  describe('#unregister', function (done) {

    it('should unregister an hotkey and register again', function () {
      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      hotkey.unregister();

      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      hotkey.should.be.a('object');
      hotkey.getKey().should.equal('E');
      hotkey.getModifiers().should.equal('cmd+shift');
    });

    it('should let unregister an hotkey more than once', function () {
      var res;

      hotkey = new HotKey({ key: "E", modifiers: "cmd+shift", failed: done });

      res = hotkey.unregister();
      res.should.equal(true);

      res = hotkey.unregister();
      res.should.equal(false);

      res = hotkey.unregister();
      res.should.equal(false);
    });

  });
});

// TODO test with send key emulation
