#include "global_hotkey_manager.h"

using namespace v8;

namespace hotkey {

  OSStatus HotKeyHandler(EventHandlerCallRef nextHandler, EventRef anEvent, void *userData) {
    NanScope();
    
    EventHotKeyID hotKeyID;

    // retrieve EventHotKeyID from the event
    GetEventParameter(anEvent, kEventParamDirectObject, typeEventHotKeyID, NULL, sizeof(hotKeyID), NULL, &hotKeyID);

    if (callback) {
      Local<Value> argv[2];
      switch (GetEventKind(anEvent)) {
        case kEventHotKeyPressed:
          argv[0] = NanNew<String>("hotkeyPressed");
          argv[1] = NanNew<Number>(hotKeyID.id);
          callback->Call(2, argv);
        break;
        case kEventHotKeyReleased:
          argv[0] = NanNew<String>("hotkeyReleased");
          argv[1] = NanNew<Number>(hotKeyID.id);
          callback->Call(2, argv);
        break;
      }
    }

    return noErr;
  }

  void InitGlobalHotkeysListener(void) {
    EventTypeSpec eventTypes[2];
    OSStatus err;

    eventTypes[0].eventClass = kEventClassKeyboard;
    eventTypes[0].eventKind = kEventHotKeyPressed;

    eventTypes[1].eventClass = kEventClassKeyboard;
    eventTypes[1].eventKind = kEventHotKeyReleased;

    // TODO store eventHandler reference? i.e. EventHandlerRef eventHandler;
    // register event handler
    err = InstallApplicationEventHandler(&HotKeyHandler, 2, eventTypes, NULL, NULL);

    if (err) {
      fprintf(stderr, "%s failed to install application event handler: %s\n", __PRETTY_FUNCTION__, GetMacOSStatusErrorString(err));
        // TODO kInstallApplicationEventHandlerFailed
      return;
    }
  }

  NAN_METHOD(SetCallback) {
    NanScope();

    if (!args[0]->IsFunction()) { 
      NanThrowError("Must supply function as first and only argument");
    }

    // free previous callback if any
    if (callback) { delete callback; }

    NanCallback *callback_ = new NanCallback(args[0].As<Function>());
    callback = callback_;

    NanReturnUndefined();
  }

  NAN_METHOD(RegisterHotKey) {
    NanScope();

    EventHotKeyID hotKeyID;
    EventHotKeyRef hotKeyRef;
    OSStatus err;

    if (!args[0]->IsInt32()) {
      NanThrowError("First argument of (keycode) registerHotkey must be an integer");
    }

    if (!args[1]->IsInt32()) {
      NanThrowError("Second argument (modifiers bit mask) of registerHotkey must be an integer");
    }

    UInt32 keycode    = args[0]->Uint32Value();
    UInt32 modifiers  = args[1]->Uint32Value();

    hotKeyID.id = count++;
    hotKeyID.signature = 'hkey';

    err = RegisterEventHotKey(keycode, modifiers, hotKeyID, GetApplicationEventTarget(), 0, &hotKeyRef);
    if (err) {
      // TODO pass err with message
      NanThrowError("Failed to register event hotkey");
    }

    hotKeysMap[hotKeyID.id] = hotKeyRef;

    NanReturnValue(NanNew<Number>(hotKeyID.id));
  }

  NAN_METHOD(UnregisterHotKey) {
    NanScope();

    UInt32 hotKeyID;
    EventHotKeyRef hotKeyRef;

    if (!args[0]->IsInt32()) {
      NanThrowError("First argument of unregisterHotkey must be an integer");
    }
    hotKeyID = args[0]->Uint32Value();

    if (hotKeysMap.count(hotKeyID) <= 0) {
      fprintf(stderr, "%s %u\n", __PRETTY_FUNCTION__, hotKeyID);
      NanThrowError("No registered hotkey found for the given id");
    }
    hotKeyRef = hotKeysMap[hotKeyID];
    UnregisterEventHotKey(hotKeyRef);
    hotKeysMap.erase(hotKeyID);

    NanReturnUndefined();
  }

  void InitAll(Handle<Object> exports) {
    NanScope();

    InitGlobalHotkeysListener();

    // Exports
    NODE_SET_METHOD(exports, "setCallback", SetCallback);
    NODE_SET_METHOD(exports, "registerHotkey", RegisterHotKey);
    NODE_SET_METHOD(exports, "unregisterHotkey", UnregisterHotKey);
  }

  NODE_MODULE(globalHotkeyManager, InitAll)
}