import { useEffect, useRef } from "react";
import {
  moveGamepadFocus,
  confirmGamepadFocus,
  dismissActiveOverlay,
  ensureInitialFocus,
} from "./gamepadSpatialNav";
import { isPlayerGamepadActive } from "./gamepadPlayerState";

/**
 * Universal TV Remote & D-Pad Keyboard Navigation for AetherFlix.
 *
 * Supports:
 * - Android TV / Google TV / Fire TV remotes
 * - Samsung Tizen TV remotes (D-Pad, 10009 Return, colored keys)
 * - LG webOS remotes
 * - Keyboard arrow navigation on desktop browsers
 */
export function useTvRemoteNav({ onBack, onOpenSearch }) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const onOpenSearchRef = useRef(onOpenSearch);
  onOpenSearchRef.current = onOpenSearch;

  useEffect(() => {
    function handleKeyDown(e) {
      // When a video is playing, allow media controls or let the player handle it
      if (isPlayerGamepadActive()) {
        if (
          e.key === "Escape" ||
          e.key === "Back" ||
          e.key === "BrowserBack" ||
          e.key === "XF86Back" ||
          e.keyCode === 10009 ||
          e.keyCode === 27
        ) {
          e.preventDefault();
          if (!dismissActiveOverlay()) {
            onBackRef.current?.();
          }
        }
        return;
      }

      // If user is currently typing in an input field, don't intercept typing
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      // Samsung Tizen return button keyCode = 10009
      // Android Back button keyCode = 4
      const isBackKey =
        e.key === "Escape" ||
        e.key === "Back" ||
        e.key === "BrowserBack" ||
        e.key === "XF86Back" ||
        e.keyCode === 10009 ||
        e.keyCode === 4;

      if (isBackKey) {
        e.preventDefault();
        if (!dismissActiveOverlay()) {
          onBackRef.current?.();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "Up":
          if (isInput && activeTag === "textarea") return;
          e.preventDefault();
          ensureInitialFocus();
          moveGamepadFocus("up");
          break;

        case "ArrowDown":
        case "Down":
          if (isInput && activeTag === "textarea") return;
          e.preventDefault();
          ensureInitialFocus();
          moveGamepadFocus("down");
          break;

        case "ArrowLeft":
        case "Left":
          if (isInput) return;
          e.preventDefault();
          ensureInitialFocus();
          moveGamepadFocus("left");
          break;

        case "ArrowRight":
        case "Right":
          if (isInput) return;
          e.preventDefault();
          ensureInitialFocus();
          moveGamepadFocus("right");
          break;

        case "Enter":
        case "Select":
          if (isInput) return;
          e.preventDefault();
          ensureInitialFocus();
          confirmGamepadFocus();
          break;

        // TV Remote Color Buttons
        case "ColorF0Red":
        case "F1":
          e.preventDefault();
          onOpenSearchRef.current?.();
          break;

        default:
          break;
      }
    }

    // Samsung Tizen hardware back button listener
    function handleTizenHwKey(e) {
      if (e.keyName === "back") {
        if (!dismissActiveOverlay()) {
          onBackRef.current?.();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("tizenhwkey", handleTizenHwKey);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("tizenhwkey", handleTizenHwKey);
    };
  }, []);
}