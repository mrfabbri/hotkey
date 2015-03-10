#ifndef HOTKEY_H
#define HOTKEY_H

#include <node.h>
#include <node_object_wrap.h>
#include <nan.h>
#include <Carbon/Carbon.h>

class HotKey : public node::ObjectWrap {
 public:
  static void Init(v8::Handle<v8::Object> exports);

  int keycode_;
  int modifiers_;
  NanCallback *callback;
  EventHotKeyID hotKeyID;
  EventHotKeyRef hotKeyRef;

 private:
  explicit HotKey(int keyCode = 0, int modifiers = 0);
  ~HotKey();


  static NAN_METHOD(New);
  static NAN_METHOD(SetCallback);
  static v8::Persistent<v8::Function> constructor;
};

#endif