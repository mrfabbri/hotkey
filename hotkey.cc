#include "hotkey.h"

using namespace v8;

Persistent<Function> HotKey::constructor;

HotKey::HotKey(int keycode, int modifiers) :  keycode_(keycode),
                                              modifiers_(modifiers) {
  InstallGlobalHotKey();
}

HotKey::~HotKey() {
  if (callback) {
    delete callback;
  }

  UnregisterEventHotKey(hotKeyRef);

  // TODO EventHotKeyID hotKeyID; EventHotKeyRef hotKeyRef;
}

OSStatus HotKeyHandler(EventHandlerCallRef nextHandler, EventRef anEvent, void *userData) {
    EventHotKeyID hotKeyID;
    HotKey *hotkey = (HotKey *)userData;

    fprintf(stderr, "A GLOBAL HOTKEY\n");
    
    GetEventParameter(anEvent, kEventParamDirectObject, typeEventHotKeyID, NULL, sizeof(hotKeyID), NULL, &hotKeyID);
    if (hotkey->callback && hotkey->hotKeyID.id == hotKeyID.id) {
      Local<Value> argv[1];
      switch (GetEventKind(anEvent)) {
        case kEventHotKeyPressed:
          argv[0] = NanNew<String>("hotKeyPressed");
          hotkey->callback->Call(1, argv);
        break;
        case kEventHotKeyReleased:
          argv[0] = NanNew<String>("hotKeyReleased");
          hotkey->callback->Call(1, argv);
        break;
      }
    }

    return noErr;
}

void HotKey::InstallGlobalHotKey() {
    EventHotKeyRef hotKeyRef;
    EventHotKeyID hotKeyID;
    EventTypeSpec eventTypes[2];
    OSStatus err;

    eventTypes[0].eventClass = kEventClassKeyboard;
    eventTypes[0].eventKind = kEventHotKeyPressed;

    eventTypes[1].eventClass = kEventClassKeyboard;
    eventTypes[1].eventKind = kEventHotKeyReleased;

    err = InstallApplicationEventHandler(&HotKeyHandler, 2, eventTypes, this, NULL);

    if (err) {
      fprintf(stderr, "%s failed to install application event handler: %s\n", __PRETTY_FUNCTION__, GetMacOSStatusErrorString(err));
      // TODO kInstallApplicationEventHandlerFailed
      return;
    }

    hotKeyID.id = HotKey::count++;
    // TODO proper OSType from HotKey::count
    hotKeyID.signature = 'hkey';
    this->hotKeyID = hotKeyID;

    err = RegisterEventHotKey(kVK_ANSI_R, cmdKey + optionKey, hotKeyID, GetApplicationEventTarget(), 0, &hotKeyRef);
    if (err) {
      fprintf(stderr, "%s failed to register event hotkey: %s\n", __PRETTY_FUNCTION__, GetMacOSStatusErrorString(err));
      // TODO kRegisterEventHotKeyFailed
      return;
    }
    this->hotKeyRef = hotKeyRef;
}

void HotKey::Init(Handle<Object> exports) {
  NanScope();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = NanNew<FunctionTemplate>(New);
  tpl->SetClassName(NanNew("HotKey"));
  tpl->InstanceTemplate()->SetInternalFieldCount(2);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "setListener", SetCallback);

  NanAssignPersistent(constructor, tpl->GetFunction());
  exports->Set(NanNew("HotKey"), tpl->GetFunction());
}

NAN_METHOD(HotKey::New) {
  NanScope();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new HotKey(...)`
    int ansiCode = args[0]->IsUndefined() ? 0 : (int) args[0]->Int32Value();
    int modifiers = args[1]->IsUndefined() ? 0 : (int) args[1]->Int32Value();

    HotKey* obj = new HotKey(ansiCode, modifiers);
    obj->Wrap(args.This());
    NanReturnValue(args.This());
  } else {
    // Invoked as plain function `HotKey(...)`, turn into construct call.
    const int argc = 2;
    Local<Value> argv[argc] = { args[0], args[1] };
    Local<Function> cons = NanNew<Function>(constructor);
    NanReturnValue(cons->NewInstance(argc, argv));
  }
}

NAN_METHOD(HotKey::SetCallback) {
  NanScope();

  HotKey* obj = ObjectWrap::Unwrap<HotKey>(args.Holder());

  // TODO proper error handling
  if (args[0]->IsUndefined()) { NanReturnUndefined(); }

  NanCallback *callback = new NanCallback(args[0].As<Function>());
  obj->callback = callback;

  NanReturnUndefined();
}
