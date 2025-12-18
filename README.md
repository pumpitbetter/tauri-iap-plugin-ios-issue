# Tauri IAP Plugin - iOS Integration Issue

This is a minimal reproduction case demonstrating that `tauri-plugin-iap` does not work on iOS when added as a standard Cargo dependency in Tauri v2.

## The Problem

When adding `tauri-plugin-iap = "0.5.0"` to a Tauri iOS project:

1. ✅ Rust compilation succeeds
2. ✅ Plugin initializes in Rust (`tauri_plugin_iap::init()`)
3. ❌ **Swift package is NOT discovered** by Tauri's Xcode project generation
4. ❌ JavaScript API is not exposed (`window.__TAURI__.plugins.iap` is undefined)

## Reproduction Steps

### Prerequisites
- macOS with Xcode installed
- Rust and Bun (or npm)
- iOS device or simulator
- Apple Developer account for code signing

### Steps

1. **Clone and install dependencies:**
   ```bash
   git clone <this-repo>
   cd tauri-iap-test
   bun install
   ```

2. **Add your development team to `src-tauri/tauri.conf.json`:**
   ```json
   "iOS": {
     "minimumSystemVersion": "15.0",
     "developmentTeam": "YOUR_TEAM_ID"
   }
   ```

3. **Build for iOS:**
   ```bash
   bun run tauri ios init    # Generate Xcode project
   bun run tauri ios build --export-method debugging --debug
   ```

4. **Verify Swift package was NOT discovered:**
   ```bash
   grep -i "tauri-plugin-iap" src-tauri/gen/apple/tmptauri-iap-test.xcodeproj/project.pbxproj
   # Returns: (empty - no matches found)
   ```

5. **Install on device and test:**
   ```bash
   ios-deploy --bundle "src-tauri/gen/apple/build/arm64/tmptauri-iap-test.ipa"
   ```

6. **Launch app and tap "Test Purchase Command" button**
   - **Expected:** Purchase dialog or error from StoreKit
   - **Actual:** ❌ "IAP plugin not found on window.__TAURI__"

## Technical Details

### What Works
- ✅ Cargo dependency added successfully
- ✅ Rust code compiles without errors
- ✅ Plugin initialization succeeds: `.plugin(tauri_plugin_iap::init())`
- ✅ Xcode project builds successfully
- ✅ App launches on device

### What Doesn't Work
- ❌ Swift package from `tauri-plugin-iap/ios/Package.swift` not discovered
- ❌ No references to "tauri-plugin-iap" in `project.pbxproj`
- ❌ Swift code never compiled or linked
- ❌ JavaScript commands not registered (`purchase`, `getProducts`, etc.)

### Root Cause Analysis

Tauri's iOS build system (via `cargo tauri ios init` → xcodegen) does **not** auto-discover Swift packages from Cargo dependencies. The generated `project.yml` has no `packages:` section for Swift Package Manager.

This works for official Tauri plugins (like `tauri-plugin-opener`) because they're in Tauri's own workspace, but fails for third-party plugins distributed via crates.io or git.

### Attempted Workarounds (All Failed)
1. ❌ Git dependency: `tauri-plugin-iap = { git = "..." }`
2. ❌ Path dependency: `tauri-plugin-iap = { path = "../../packages/tauri-plugin-iap" }`
3. ❌ Manual Xcode Swift package addition (requires `.tauri/tauri-api` which doesn't exist in cargo location)
4. ❌ build.rs with `tauri_utils::build::link_apple_library()` (runs too late)

## Environment

- **Tauri:** v2.x (latest stable)
- **tauri-plugin-iap:** v0.5.0
- **Xcode:** 17.0.1
- **iOS Deployment Target:** 15.0+
- **macOS:** Sequoia 15.2
- **Rust:** 1.83.0
- **Device:** iPhone 8 Plus (iOS 16.7.12)

## Expected Behavior

The plugin should work like official Tauri plugins:
- Swift package automatically discovered during `cargo tauri ios init`
- Added to Xcode project's Swift Package Manager dependencies
- Swift code compiled and linked into final binary
- JavaScript API exposed via Tauri's plugin system

## Related Issues

- Is this a limitation of Tauri v2's mobile architecture?
- Is there a special way third-party plugins must be structured?
- Should plugins be distributed differently for iOS support?

## Questions for Maintainers

1. **Is iOS support for third-party plugins officially supported in Tauri v2?**
2. **If yes, what's the correct way to integrate a Swift-based plugin?**
3. **If no, what's the recommended alternative for mobile IAP?**

---

**Reproduction case created:** December 18, 2025  
**Tauri Plugin IAP Version:** 0.5.0  
**Confirmed minimal, clean environment**
