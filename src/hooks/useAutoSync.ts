import { useEffect, useRef, useCallback, useState } from "react";
import {
  getPendingTransactions,
  getPendingCount,
  markTransactionSynced,
  markTransactionFailed,
} from "@/services/offlineTransactionService";
import { useSyncOfflineTransactionMutation } from "@/store/api/Transaction";
import { toast } from "sonner";

/** How often to poll for pending transactions when online (ms) */
const SYNC_INTERVAL = 30_000; // 30 seconds

/** Delay before the first sync attempt after coming online (ms) */
const ONLINE_DELAY = 3_000; // 3 seconds – let the connection stabilise

/**
 * Hook that automatically syncs offline transactions when internet is available.
 *
 * - Listens to browser `online` / `offline` events.
 * - When online, polls the local SQLite DB for pending transactions.
 * - Sends them **one-by-one** to `sync_offline_transaction`.
 * - Marks each row as synced / failed in SQLite.
 * - Exposes `pendingCount` and a manual `triggerSync()` for the UI.
 */
export function useAutoSync() {
  const [syncOffline] = useSyncOfflineTransactionMutation();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Refs to avoid stale closures in intervals/timeouts
  const isSyncingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Refresh the pending count from SQLite ──────────────────────────
  const refreshCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
    } catch {
      // Tauri invoke may not be ready yet during HMR – swallow
    }
  }, []);

  // ── Core sync logic ────────────────────────────────────────────────
  const syncAll = useCallback(async () => {
    // Guard: don't overlap
    if (isSyncingRef.current) return;
    if (!navigator.onLine) return;

    let pending;
    try {
      pending = await getPendingTransactions();
    } catch {
      return;
    }

    if (pending.length === 0) {
      await refreshCount();
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);

    let synced = 0;
    let failed = 0;

    for (const txn of pending) {
      // Re-check connectivity before each request
      if (!navigator.onLine) {
        console.log("🔌 [AutoSync] Lost connection mid-sync, stopping.");
        break;
      }

      try {
        const payload = JSON.parse(txn.payload);
        await syncOffline(payload).unwrap();
        await markTransactionSynced(txn.id);
        synced++;
        console.log(`✅ [AutoSync] Synced offline txn id=${txn.id}`);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        await markTransactionFailed(txn.id, errMsg);
        failed++;
        console.error(`❌ [AutoSync] Failed txn id=${txn.id}: ${errMsg}`);
      }
    }

    isSyncingRef.current = false;
    setIsSyncing(false);
    await refreshCount();

    // Notify only when something actually happened
    if (synced > 0 || failed > 0) {
      if (synced > 0 && failed === 0) {
        toast.success(
          `Synced ${synced} offline transaction${synced > 1 ? "s" : ""}`,
          { duration: 3000 },
        );
      } else if (synced > 0 && failed > 0) {
        toast.warning(
          `Synced ${synced}, failed ${failed} transaction${failed > 1 ? "s" : ""}`,
          { duration: 4000 },
        );
      } else {
        toast.error(
          `Failed to sync ${failed} transaction${failed > 1 ? "s" : ""}`,
          { description: "Will retry automatically", duration: 4000 },
        );
      }
    }
  }, [syncOffline, refreshCount]);

  // ── Manual trigger exposed to the UI ───────────────────────────────
  const triggerSync = useCallback(() => {
    if (!navigator.onLine) {
      toast.error("No internet connection", { duration: 2000 });
      return;
    }
    syncAll();
  }, [syncAll]);

  // ── Online / Offline listeners ─────────────────────────────────────
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      console.log("🌐 [AutoSync] Back online – will sync shortly…");

      // Small delay so the network fully stabilises
      timeoutRef.current = setTimeout(() => {
        syncAll();
      }, ONLINE_DELAY);
    };

    const goOffline = () => {
      setIsOnline(false);
      console.log("🔌 [AutoSync] Went offline");
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [syncAll]);

  // ── Polling interval (only while online) ───────────────────────────
  useEffect(() => {
    // Always refresh count on mount
    refreshCount();

    if (!isOnline) {
      // Clear interval when offline
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Attempt a sync right away
    syncAll();

    // Then poll every SYNC_INTERVAL
    intervalRef.current = setInterval(() => {
      syncAll();
    }, SYNC_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOnline, syncAll, refreshCount]);

  return { pendingCount, isSyncing, isOnline, triggerSync };
}
