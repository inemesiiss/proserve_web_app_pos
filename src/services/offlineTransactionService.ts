import { invoke } from "@tauri-apps/api/core";

export interface OfflineTransaction {
  id: number;
  payload: string;
  status: string;
  created_at: string;
  synced_at: string | null;
  error_msg: string | null;
}

/**
 * Save a failed transaction payload to local SQLite for later sync.
 * Call this when the API call to create_cashier_transaction fails (network error, etc.)
 */
export async function saveOfflineTransaction(
  payload: Record<string, unknown>,
): Promise<number> {
  const jsonPayload = JSON.stringify(payload);
  const id = await invoke<number>("save_offline_transaction", {
    payload: jsonPayload,
  });
  console.log(
    `💾 [Offline] Transaction saved locally with id=${id}`,
  );
  return id;
}

/**
 * Get all pending (un-synced) transactions from local SQLite.
 */
export async function getPendingTransactions(): Promise<OfflineTransaction[]> {
  return invoke<OfflineTransaction[]>("get_pending_transactions");
}

/**
 * Get the count of pending offline transactions.
 */
export async function getPendingCount(): Promise<number> {
  return invoke<number>("get_pending_count");
}

/**
 * Mark a transaction as successfully synced to the server.
 */
export async function markTransactionSynced(id: number): Promise<void> {
  await invoke("mark_transaction_synced", { id });
}

/**
 * Mark a transaction as failed with an error message.
 */
export async function markTransactionFailed(
  id: number,
  error: string,
): Promise<void> {
  await invoke("mark_transaction_failed", { id, error });
}

/**
 * Attempt to sync all pending offline transactions to the server.
 * Requires a callback function that sends the payload to the API.
 * Returns the number of successfully synced transactions.
 */
export async function syncPendingTransactions(
  sendToServer: (payload: Record<string, unknown>) => Promise<unknown>,
): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingTransactions();
  let synced = 0;
  let failed = 0;

  for (const txn of pending) {
    try {
      const payload = JSON.parse(txn.payload);
      await sendToServer(payload);
      await markTransactionSynced(txn.id);
      synced++;
      console.log(`✅ [Offline] Synced transaction id=${txn.id}`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await markTransactionFailed(txn.id, errMsg);
      failed++;
      console.error(
        `❌ [Offline] Failed to sync transaction id=${txn.id}: ${errMsg}`,
      );
    }
  }

  console.log(
    `📊 [Offline] Sync complete: ${synced} synced, ${failed} failed out of ${pending.length} pending`,
  );
  return { synced, failed };
}
