#ifndef HOTKEY_H
#define HOTKEY_H

#include <node.h>
#include <node_object_wrap.h>
#include <nan.h>
#include <Carbon/Carbon.h>

class HotKey : public node::ObjectWrap {
 public:
  static void Init(v8::Handle<v8::Object> exports);

  static uint count;

  int keycode_;
  int modifiers_;
  NanCallback *callback;
  EventHotKeyID hotKeyID;
  EventHotKeyRef hotKeyRef;

 private:
  explicit HotKey(int keyCode = 0, int modifiers = 0);
  ~HotKey();

  // OSStatus HotKeyHandler(EventHandlerCallRef nextHandler, EventRef anEvent, void *userData);
  void InstallGlobalHotKey(void);


  static NAN_METHOD(New);
  static NAN_METHOD(SetCallback);
  static v8::Persistent<v8::Function> constructor;
};

#endif