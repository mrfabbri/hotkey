#include <nan.h>
#include "hotkey.h"

using namespace v8;

void InitAll(Handle<Object> exports) {
  HotKey::Init(exports);
}

NODE_MODULE(hotkey, InitAll)