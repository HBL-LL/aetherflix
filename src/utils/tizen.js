/**
 * Samsung Tizen Smart TV integration helper for AetherFlix.
 * Registers input device keys with Tizen TV OS so media keys and colored buttons work.
 */
export function initTizenTV() {
  if (typeof window === "undefined") return;

  if (window.tizen && window.tizen.tvinputdevice) {
    const keysToRegister = [
      "MediaPlayPause",
      "MediaPlay",
      "MediaPause",
      "MediaStop",
      "MediaFastForward",
      "MediaRewind",
      "Search",
      "ColorF0Red",
      "ColorF1Green",
      "ColorF2Yellow",
      "ColorF3Blue"
    ];

    keysToRegister.forEach((keyName) => {
      try {
        window.tizen.tvinputdevice.registerKey(keyName);
      } catch (err) {
        // Some keys might not be supported on older Tizen versions
      }
    });

    console.log("[AetherFlix Tizen] Registered TV remote keys");
  }
}