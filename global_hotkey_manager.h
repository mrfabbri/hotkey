#ifndef GLOBAL_HOTKEY_MANAGER_H
#define GLOBAL_HOTKEY_MANAGER_H

#include <node.h>
#include <node_object_wrap.h>
#include <nan.h>
#include <Carbon/Carbon.h>

namespace hotkey {

  // counter for EventHotKeyID.id;
  static uint count;

  // listener callback reference 
  static NanCallback *callback;


  static void InitAll(v8::Handle<v8::Object> exports);

  static NAN_METHOD(SetCallback);
  static NAN_METHOD(RegisterHotKey);
  static NAN_METHOD(UnregisterHotKey);
}
#endif