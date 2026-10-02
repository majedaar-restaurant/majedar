/**
 * Admin Continuous Order Alert Manager
 *
 * Manages the continuous looping audio ringtone and pending orders
 * waiting for restaurant acceptance.
 *
 * Features:
 * - Single global alert manager (prevents overlapping audio loops)
 * - Self-contained Web Audio API synthesizer (no external audio assets needed, zero 404s)
 * - Autoplay policy detection with explicit audio unlock flow
 * - Tracks each pending order's acceptanceDeadline independently
 * - Audio plays continuously while >= 1 pending unconfirmed order exists
 * - Automatically stops audio when all pending orders are confirmed, expired, or cancelled
 * - If one order is confirmed while another is pending, audio continues uninterrupted
 */

class OrderAlertManager {
  constructor() {
    this.pendingOrders = new Map(); // orderId -> { orderId, orderNumber, total, acceptanceDeadline }
    this.isAudioPlaying = false;
    this.audioContext = null;
    this.loopTimer = null;
    this.tickTimer = null;
    this.isUnlocked = false;
    this.isEnabled = true;
    this.subscribers = new Set();

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_sound_alert_enabled");
      if (stored !== null) {
        this.isEnabled = stored === "true";
      }

      // Auto-unlock on first user interaction if not already unlocked
      const handleUserGesture = () => {
        this.unlockAudio().catch(() => {});
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
      };
      window.addEventListener("click", handleUserGesture, { once: true });
      window.addEventListener("keydown", handleUserGesture, { once: true });
      window.addEventListener("touchstart", handleUserGesture, { once: true });

      // Per-second expiration checker
      this.tickTimer = setInterval(() => this.checkExpirations(), 1000);
    }
  }

  /**
   * Subscribe to alert manager state changes (pending count, sound playing, unlocked state).
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notify() {
    const state = this.getState();
    for (const sub of this.subscribers) {
      try {
        sub(state);
      } catch (_) {}
    }
  }

  getState() {
    return {
      pendingCount: this.pendingOrders.size,
      pendingOrders: Array.from(this.pendingOrders.values()),
      isAudioPlaying: this.isAudioPlaying,
      isUnlocked: this.isUnlocked,
      isEnabled: this.isEnabled,
    };
  }

  /**
   * Initialize or resume the Web Audio context after a user gesture.
   */
  async unlockAudio() {
    if (typeof window === "undefined") return false;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isUnlocked = this.audioContext.state === "running";

      // If we already have pending orders waiting, start the ringtone now that we are unlocked
      if (this.isUnlocked && this.pendingOrders.size > 0 && this.isEnabled && !this.isAudioPlaying) {
        this.startLoop();
      }

      this.notify();
      return this.isUnlocked;
    } catch {
      return false;
    }
  }

  /**
   * Enable or disable audio alerts (admin preference).
   */
  setEnabled(enabled) {
    this.isEnabled = Boolean(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_sound_alert_enabled", String(this.isEnabled));
    }
    if (!this.isEnabled) {
      this.stopLoop();
    } else if (this.pendingOrders.size > 0) {
      this.startLoop();
    }
    this.notify();
  }

  toggleEnabled() {
    this.setEnabled(!this.isEnabled);
  }

  /**
   * Plays a single pleasant, melodic restaurant alert chime (C5 → E5 → G5 → C6).
   */
  playChimeTone() {
    if (!this.audioContext || this.audioContext.state !== "running") return;

    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // 4 bell tones: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
      const notes = [
        { freq: 523.25, time: now + 0.0 },
        { freq: 659.25, time: now + 0.12 },
        { freq: 783.99, time: now + 0.24 },
        { freq: 1046.5, time: now + 0.36 },
      ];

      for (const { freq, time } of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        // Soft bell-like decay
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.36);
      }
    } catch (_) {}
  }

  /**
   * Start the repeating audio ringtone loop.
   */
  startLoop() {
    if (this.isAudioPlaying) return;
    if (!this.isEnabled) return;

    this.isAudioPlaying = true;
    this.notify();

    // Play immediately
    this.playChimeTone();

    // Repeat every 1.8 seconds while orders remain pending
    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      if (this.pendingOrders.size === 0 || !this.isEnabled) {
        this.stopLoop();
        return;
      }
      this.playChimeTone();
    }, 1800);
  }

  /**
   * Stop the looping audio ringtone immediately.
   */
  stopLoop() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.isAudioPlaying) {
      this.isAudioPlaying = false;
      this.notify();
    }
  }

  /**
   * Add a newly arrived placed order awaiting acceptance.
   */
  addPendingOrder(order) {
    if (!order) return;
    const orderId = String(order.orderId || order._id || "");
    if (!orderId) return;

    const deadline = order.acceptanceDeadline ? new Date(order.acceptanceDeadline).getTime() : 0;
    // Only track if deadline is still in the future
    if (deadline && deadline <= Date.now()) return;

    this.pendingOrders.set(orderId, {
      orderId,
      orderNumber: order.orderNumber || orderId,
      total: order.total,
      acceptanceDeadline: order.acceptanceDeadline,
    });

    if (this.isEnabled) {
      // Try unlocking audio if needed
      if (!this.isUnlocked) {
        this.unlockAudio().then((unlocked) => {
          if (unlocked && this.pendingOrders.size > 0) {
            this.startLoop();
          }
        });
      } else {
        this.startLoop();
      }
    }

    this.notify();
  }

  /**
   * Remove a confirmed, cancelled, or expired order.
   * If other pending orders remain, audio alert continues!
   * If all pending orders are resolved, audio alert immediately stops.
   */
  removePendingOrder(orderId) {
    if (!orderId) return;
    const id = String(orderId);
    if (!this.pendingOrders.has(id)) return;

    this.pendingOrders.delete(id);

    // Only stop audio if NO MORE pending orders require attention
    if (this.pendingOrders.size === 0) {
      this.stopLoop();
    }

    this.notify();
  }

  /**
   * Synchronize pending orders from an updated order list from the backend.
   */
  syncPendingOrders(ordersList) {
    if (!Array.isArray(ordersList)) return;

    const now = Date.now();
    const newMap = new Map();

    for (const ord of ordersList) {
      if (
        ord.orderStatus === "placed" &&
        ord.acceptanceDeadline &&
        new Date(ord.acceptanceDeadline).getTime() > now
      ) {
        const id = String(ord._id || ord.orderId);
        newMap.set(id, {
          orderId: id,
          orderNumber: ord.orderNumber || id,
          total: ord.total,
          acceptanceDeadline: ord.acceptanceDeadline,
        });
      }
    }

    this.pendingOrders = newMap;

    if (this.pendingOrders.size > 0 && this.isEnabled && this.isUnlocked) {
      this.startLoop();
    } else if (this.pendingOrders.size === 0) {
      this.stopLoop();
    }

    this.notify();
  }

  /**
   * Per-second tick to check if any pending orders reached their acceptance deadline.
   */
  checkExpirations() {
    if (this.pendingOrders.size === 0) return;

    const now = Date.now();
    let changed = false;

    for (const [orderId, order] of this.pendingOrders.entries()) {
      if (order.acceptanceDeadline && new Date(order.acceptanceDeadline).getTime() <= now) {
        this.pendingOrders.delete(orderId);
        changed = true;
      }
    }

    if (changed) {
      if (this.pendingOrders.size === 0) {
        this.stopLoop();
      }
      this.notify();
    }
  }
}

// Singleton instance across admin panel
export const alertManager = new OrderAlertManager();
