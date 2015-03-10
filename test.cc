#include <Carbon/Carbon.h>

// counter for EventHotkeyID.id;
static uint count;

OSStatus HotkeyHandler(EventHandlerCallRef nextHandler, EventRef anEvent, void *userData) {
  EventHotkeyID hotKeyID;
  // Hotkey *hotkey = (Hotkey *)userData;

  // TODO DEBUG
  fprintf(stderr, "A GLOBAL HOTKEY\n");
  
  // GetEventParameter(anEvent, kEventParamDirectObject, typeEventHotkeyID, NULL, sizeof(hotKeyID), NULL, &hotKeyID);
  // if (hotkey->callback && hotkey->hotKeyID.id == hotKeyID.id) {
  //   Local<Value> argv[1];
  //   switch (GetEventKind(anEvent)) {
  //     case kEventHotkeyPressed:
  //       argv[0] = NanNew<String>("hotKeyPressed");
  //       hotkey->callback->Call(1, argv);
  //     break;
  //     case kEventHotkeyReleased:
  //       argv[0] = NanNew<String>("hotKeyReleased");
  //       hotkey->callback->Call(1, argv);
  //     break;
  //   }
  // }

  return noErr;
}

void InstallGlobalHotkey(int keycode, int modifiers) {
  EventHotkeyRef hotKeyRef;
  EventHotkeyID hotKeyID;
  EventTypeSpec eventTypes[2];
  OSStatus err;

  // TODO DEBUG
  fprintf(stderr, "%s keycode: %d\n", __PRETTY_FUNCTION__, keycode);
  fprintf(stderr, "%s modifiers: %d\n", __PRETTY_FUNCTION__, modifiers);

  eventTypes[0].eventClass = kEventClassKeyboard;
  eventTypes[0].eventKind = kEventHotkeyPressed;

  eventTypes[1].eventClass = kEventClassKeyboard;
  eventTypes[1].eventKind = kEventHotkeyReleased;

  err = InstallApplicationEventHandler(&HotkeyHandler, 2, eventTypes, NULL, NULL);

  if (err) {
    fprintf(stderr, "%s failed to install application event handler: %s\n", __PRETTY_FUNCTION__, GetMacOSStatusErrorString(err));
    // TODO kInstallApplicationEventHandlerFailed
    return;
  }

  // TODO DEBUG
  fprintf(stderr, "%s \n", "post installation");

  hotKeyID.id = count++;
  hotKeyID.signature = 'hkey';
  // hotkey->hotKeyID = hotKeyID;

  // err = RegisterEventHotkey(keycode, modifiers, hotKeyID, GetApplicationEventTarget(), 0, &hotKeyRef);
  err = RegisterEventHotkey(kVK_ANSI_R, cmdKey+shiftKey, hotKeyID, GetApplicationEventTarget(), 0, &hotKeyRef);
  if (err) {
    fprintf(stderr, "%s failed to register event hotkey: %s\n", __PRETTY_FUNCTION__, GetMacOSStatusErrorString(err));
    // TODO kRegisterEventHotkeyFailed
    return;
  }
  // hotkey->hotKeyRef = hotKeyRef;

  // TODO DEBUG
  fprintf(stderr, "%s \n", "post registration");
  fprintf(stderr, "%u \n", hotKeyID.id);
}

int main(int argc, char ** argv) {
  InstallGlobalHotkey(0x00, 0x00);

  CFRunLoopRun();
}