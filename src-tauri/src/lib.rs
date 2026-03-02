use tauri::{command, Window};
use tauri::Emitter;
use printers;
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[cfg(target_os = "windows")]
use std::process::Command;

// ─── Offline DB state ───
struct AppState {
    db: Mutex<Connection>,
}

fn init_db(conn: &Connection) {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS offline_transactions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            payload    TEXT    NOT NULL,
            status     TEXT    NOT NULL DEFAULT 'pending',
            created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
            synced_at  TEXT,
            error_msg  TEXT
        );"
    ).expect("Failed to create offline_transactions table");
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct OfflineTransaction {
    id: i64,
    payload: String,
    status: String,
    created_at: String,
    synced_at: Option<String>,
    error_msg: Option<String>,
}

#[command]
fn save_offline_transaction(state: tauri::State<'_, AppState>, payload: String) -> Result<i64, String> {
    println!("💾 [save_offline_transaction] Saving offline transaction ({} bytes)", payload.len());
    let db = state.db.lock().map_err(|e| format!("DB lock error: {}", e))?;
    db.execute(
        "INSERT INTO offline_transactions (payload, status) VALUES (?1, 'pending')",
        rusqlite::params![payload],
    ).map_err(|e| format!("DB insert error: {}", e))?;
    let id = db.last_insert_rowid();
    println!("✅ [save_offline_transaction] Saved with id={}", id);
    Ok(id)
}

#[command]
fn get_pending_transactions(state: tauri::State<'_, AppState>) -> Result<Vec<OfflineTransaction>, String> {
    let db = state.db.lock().map_err(|e| format!("DB lock error: {}", e))?;
    let mut stmt = db.prepare(
        "SELECT id, payload, status, created_at, synced_at, error_msg FROM offline_transactions WHERE status = 'pending' ORDER BY id ASC"
    ).map_err(|e| format!("DB prepare error: {}", e))?;
    let rows = stmt.query_map([], |row| {
        Ok(OfflineTransaction {
            id: row.get(0)?,
            payload: row.get(1)?,
            status: row.get(2)?,
            created_at: row.get(3)?,
            synced_at: row.get(4)?,
            error_msg: row.get(5)?,
        })
    }).map_err(|e| format!("DB query error: {}", e))?;
    let mut txns = Vec::new();
    for row in rows {
        txns.push(row.map_err(|e| format!("Row error: {}", e))?);
    }
    println!("📋 [get_pending_transactions] Found {} pending transactions", txns.len());
    Ok(txns)
}

#[command]
fn mark_transaction_synced(state: tauri::State<'_, AppState>, id: i64) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| format!("DB lock error: {}", e))?;
    db.execute(
        "UPDATE offline_transactions SET status = 'synced', synced_at = datetime('now','localtime') WHERE id = ?1",
        rusqlite::params![id],
    ).map_err(|e| format!("DB update error: {}", e))?;
    println!("✅ [mark_transaction_synced] Transaction {} marked as synced", id);
    Ok(())
}

#[command]
fn mark_transaction_failed(state: tauri::State<'_, AppState>, id: i64, error: String) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| format!("DB lock error: {}", e))?;
    db.execute(
        "UPDATE offline_transactions SET status = 'failed', error_msg = ?2 WHERE id = ?1",
        rusqlite::params![id, error],
    ).map_err(|e| format!("DB update error: {}", e))?;
    println!("❌ [mark_transaction_failed] Transaction {} marked as failed: {}", id, error);
    Ok(())
}

#[command]
fn get_pending_count(state: tauri::State<'_, AppState>) -> Result<i64, String> {
    let db = state.db.lock().map_err(|e| format!("DB lock error: {}", e))?;
    let count: i64 = db.query_row(
        "SELECT COUNT(*) FROM offline_transactions WHERE status = 'pending'",
        [],
        |row| row.get(0),
    ).map_err(|e| format!("DB query error: {}", e))?;
    Ok(count)
}

/// Check if any printers are installed on Windows using PowerShell
/// This avoids the crash in printers crate when no printers exist
#[cfg(target_os = "windows")]
fn has_printers_installed() -> bool {
    match Command::new("powershell")
        .args(["-Command", "@(Get-Printer).Count"])
        .output()
    {
        Ok(output) => {
            let count_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
            println!("🔍 [PowerShell] Raw printer count output: '{}'", count_str);
            
            // If the output is empty or "0", no printers
            if count_str.is_empty() || count_str == "0" {
                println!("⚠️ No printers detected via PowerShell");
                return false;
            }
            
            match count_str.parse::<i32>() {
                Ok(count) => {
                    println!("✅ Found {} printers", count);
                    count > 0
                },
                Err(e) => {
                    println!("❌ Failed to parse printer count: {} (error: {})", count_str, e);
                    // If we can't parse, it might be a printer name, so assume printers exist
                    !count_str.is_empty()
                }
            }
        }
        Err(e) => {
            println!("❌ PowerShell command failed: {}", e);
            false
        }
    }
}

#[cfg(not(target_os = "windows"))]
fn has_printers_installed() -> bool {
    true // On non-Windows, let the printers crate handle it
}

/// Safely get printers list, checking first if any exist
fn safe_get_printers() -> Vec<printers::common::base::printer::Printer> {
    #[cfg(target_os = "windows")]
    {
        if !has_printers_installed() {
            println!("⚠️ [safe_get_printers] No printers detected on Windows");
            return Vec::new();
        }
    }
    
    println!("📡 [safe_get_printers] Attempting to get printer list from printers crate...");
    let printer_list = printers::get_printers();
    
    if printer_list.is_empty() {
        println!("⚠️ [safe_get_printers] Printer list is empty");
        return Vec::new();
    }
    
    println!("✅ [safe_get_printers] Successfully retrieved {} printers", printer_list.len());
    for (i, printer) in printer_list.iter().enumerate() {
        println!("   [{}] {}", i + 1, printer.name);
    }
    printer_list
}

#[command]
fn list_printers() -> Result<Vec<String>, String> {
    println!("📋 [list_printers] Command invoked");
    let printer_list = safe_get_printers();
    
    if printer_list.is_empty() {
        println!("⚠️ [list_printers] No printers found");
        return Ok(Vec::new());
    }
    
    let names: Vec<String> = printer_list.iter().map(|p| p.name.clone()).collect();
    println!("✅ [list_printers] Returning {} printers: {:?}", names.len(), names);
    Ok(names)
}

#[command]
fn print_receipt(window: Window, printer_name: Option<String>, content: String) -> Result<(), String> {
    println!("🖨️ [print_receipt] Command invoked for printer: '{}'", printer_name.as_deref().unwrap_or("(auto)"));
    let _ = window.emit("log_event", format!("🖨️ Print requested for: {}", printer_name.as_deref().unwrap_or("(auto)")));

    let printer_list = safe_get_printers();

    if printer_list.is_empty() {
        println!("❌ No printers available");
        let _ = window.emit("log_event", "❌ No printers available");
        return Err("No printers available".to_string());
    }

    let selected = if let Some(ref name) = printer_name {
        printer_list
            .iter()
            .find(|p| p.name == *name)
            .unwrap_or_else(|| {
                println!("⚠️ Printer '{}' not found, falling back to first printer: '{}'", name, printer_list[0].name);
                &printer_list[0]
            })
    } else {
        println!("ℹ️ No printer name specified, using first printer: '{}'", printer_list[0].name);
        &printer_list[0]
    };

    println!("🖨️ Printing to: {}", selected.name);
    let _ = window.emit("log_event", format!("🖨️ Printing to: {}", selected.name));

    // Build raw ESC/POS byte payload
    let mut payload: Vec<u8> = Vec::new();

    // ESC @ — Initialize / reset printer
    payload.extend_from_slice(b"\x1B\x40");

    // Alignment commands are embedded in content from the frontend
    // (ESC a 1 = center, ESC a 0 = left)

    // Add the receipt text content as raw bytes
    payload.extend_from_slice(content.as_bytes());

    // Feed a few lines before cutting
    payload.extend_from_slice(b"\n\n\n\n");

    // GS V 1 — Partial cut (works on most thermal printers with auto-cutter)
    // 0x1D 0x56 0x01
    payload.extend_from_slice(b"\x1D\x56\x01");

    // Write raw bytes to a temp file and send via print_file with RAW datatype
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let temp_path = std::env::temp_dir().join(format!("receipt_{}.bin", timestamp));

    if let Err(e) = std::fs::write(&temp_path, &payload) {
        println!("❌ Failed to write receipt file: {:?}", e);
        let _ = window.emit("log_event", format!("❌ Failed to write receipt file: {:?}", e));
        return Err(format!("Failed to write receipt file: {:?}", e));
    }

    println!("📝 Receipt file created at: {:?} ({} bytes)", temp_path, payload.len());

    // On Windows, use the Print Spooler API (winspool) via PowerShell to send raw ESC/POS bytes
    #[cfg(target_os = "windows")]
    {
        println!("📡 Sending raw ESC/POS data to printer '{}' via winspool", selected.name);

        // PowerShell script that P/Invokes winspool.Drv to send raw bytes
        let ps_script = format!(
            r#"
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class RawPrinter {{
    [StructLayout(LayoutKind.Sequential)]
    public struct DOCINFOA {{
        [MarshalAs(UnmanagedType.LPStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPStr)] public string pDataType;
    }}
    [DllImport("winspool.Drv", EntryPoint="OpenPrinterA", SetLastError=true)]
    public static extern bool OpenPrinter(string szPrinter, out IntPtr hPrinter, IntPtr pd);
    [DllImport("winspool.Drv", EntryPoint="ClosePrinter", SetLastError=true)]
    public static extern bool ClosePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint="StartDocPrinterA", SetLastError=true)]
    public static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFOA di);
    [DllImport("winspool.Drv", EntryPoint="EndDocPrinter", SetLastError=true)]
    public static extern bool EndDocPrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint="StartPagePrinter", SetLastError=true)]
    public static extern bool StartPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint="EndPagePrinter", SetLastError=true)]
    public static extern bool EndPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.Drv", EntryPoint="WritePrinter", SetLastError=true)]
    public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);
    public static bool SendRaw(string printerName, byte[] data) {{
        IntPtr hPrinter;
        if (!OpenPrinter(printerName, out hPrinter, IntPtr.Zero)) return false;
        DOCINFOA di = new DOCINFOA();
        di.pDocName = "Receipt";
        di.pDataType = "RAW";
        if (!StartDocPrinter(hPrinter, 1, ref di)) {{ ClosePrinter(hPrinter); return false; }}
        if (!StartPagePrinter(hPrinter)) {{ EndDocPrinter(hPrinter); ClosePrinter(hPrinter); return false; }}
        IntPtr pUnmanagedBytes = Marshal.AllocCoTaskMem(data.Length);
        Marshal.Copy(data, 0, pUnmanagedBytes, data.Length);
        int written;
        bool ok = WritePrinter(hPrinter, pUnmanagedBytes, data.Length, out written);
        Marshal.FreeCoTaskMem(pUnmanagedBytes);
        EndPagePrinter(hPrinter);
        EndDocPrinter(hPrinter);
        ClosePrinter(hPrinter);
        return ok;
    }}
}}
"@
$bytes = [System.IO.File]::ReadAllBytes("{filepath}")
$ok = [RawPrinter]::SendRaw("{printername}", $bytes)
if ($ok) {{ Write-Output "OK" }} else {{ Write-Error "FAIL: winspool SendRaw returned false" }}
"#,
            filepath = temp_path.to_str().unwrap_or("").replace("\\", "\\\\"),
            printername = selected.name.replace("\"", "\\\""),
        );

        let result = Command::new("powershell")
            .args(["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", &ps_script])
            .output();

        // Clean up temp file
        let _ = std::fs::remove_file(&temp_path);

        match result {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
                println!("📋 PowerShell stdout: {}", stdout);
                if !stderr.is_empty() {
                    println!("📋 PowerShell stderr: {}", stderr);
                }

                if stdout.contains("OK") {
                    println!("✅ Raw printing succeeded to '{}'", selected.name);
                    let _ = window.emit("log_event", format!("✅ Printing succeeded to '{}'", selected.name));
                    Ok(())
                } else {
                    let err_msg = format!("Print failed: {}", if stderr.is_empty() { &stdout } else { &stderr });
                    println!("❌ {}", err_msg);
                    let _ = window.emit("log_event", format!("❌ {}", err_msg));
                    Err(err_msg)
                }
            }
            Err(e) => {
                println!("❌ Failed to execute PowerShell: {:?}", e);
                let _ = window.emit("log_event", format!("❌ Failed to execute PowerShell: {:?}", e));
                Err(format!("Failed to execute PowerShell: {:?}", e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        use printers::common::base::job::PrinterJobOptions;
        let options = PrinterJobOptions {
            name: Some("Receipt"),
            raw_properties: &[],
        };
        match selected.print_file(temp_path.to_str().unwrap_or(""), options) {
            Ok(_) => {
                println!("✅ Printing succeeded to '{}'", selected.name);
                let _ = window.emit("log_event", format!("✅ Printing succeeded to '{}'", selected.name));
                std::thread::sleep(std::time::Duration::from_millis(500));
                let _ = std::fs::remove_file(&temp_path);
                Ok(())
            }
            Err(e) => {
                println!("❌ Printing failed: {:?}", e);
                let _ = window.emit("log_event", format!("❌ Printing failed: {:?}", e));
                let _ = std::fs::remove_file(&temp_path);
                Err(format!("Printing failed: {:?}", e))
            }
        }
    }
}

pub fn run() {
    // Initialize SQLite database in app data directory
    let db_path = dirs_next::data_local_dir()
        .unwrap_or_else(|| std::path::PathBuf::from("."))
        .join("proserve_pos")
        .join("offline.db");

    // Ensure directory exists
    if let Some(parent) = db_path.parent() {
        std::fs::create_dir_all(parent).expect("Failed to create app data directory");
    }

    println!("📂 [DB] Opening database at: {:?}", db_path);
    let conn = Connection::open(&db_path).expect("Failed to open SQLite database");
    init_db(&conn);
    println!("✅ [DB] Database initialized successfully");

    let state = AppState {
        db: Mutex::new(conn),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            list_printers,
            print_receipt,
            save_offline_transaction,
            get_pending_transactions,
            mark_transaction_synced,
            mark_transaction_failed,
            get_pending_count
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
