{
  "targets": [
    {
      "target_name": "hotkey",
      "sources": [
        "addon.c",
        "hotkey.cc"
      ],
      "include_dirs": [ 
        "<!(node -e \"require('nan')\")",
        "System/Library/Frameworks/Carbon.framework/Headers"
      ]
    }
  ]
}
