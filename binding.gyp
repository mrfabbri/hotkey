{
  "targets": [
    {
      "target_name": "globalHotkeyManager",
      "sources": [
        "global_hotkey_manager.cc"
      ],
      "include_dirs": [ 
        "<!(node -e \"require('nan')\")",
        "System/Library/Frameworks/Carbon.framework/Headers"
      ]
    }
  ]
}
