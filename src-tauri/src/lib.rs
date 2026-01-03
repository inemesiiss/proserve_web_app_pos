use tauri::{command, Window};
use tauri::Emitter;
use printers;
use printers::common::base::job::PrinterJobOptions;

#[cfg(target_os = "windows")]
use std::process::Command;

/// Check if any printers are installed on Windows using PowerShell
/// This avoids the crash in printers crate when no printers exist
#[cfg(target_os = "windows")]
fn has_printers_installed() -> bool {
    match Command::new("powershell")
        .args(["-Command", "(Get-Printer).Count"])
        .output()
    {
        Ok(output) => {
            let count_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
            match count_str.parse::<i32>() {
                Ok(count) => count > 0,
                Err(_) => false,
            }
        }
        Err(_) => false,
    }
}

#[cfg(not(target_os = "windows"))]
fn has_printers_installed() -> bool {
    true // On non-Windows, let the printers crate handle it
}

/// Safely get printers list, checking first if any exist
fn safe_get_printers() -> Vec<printers::common::base::printer::Printer> {
    if !has_printers_installed() {
        println!("⚠️ No printers installed on this system");
        return Vec::new();
    }
    
    printers::get_printers()
}

#[command]
fn list_printers() -> Result<Vec<String>, String> {
    let printer_list = safe_get_printers();
    let names: Vec<String> = printer_list.iter().map(|p| p.name.clone()).collect();
    Ok(names)
}

#[command]
fn print_receipt(window: Window, content: String) -> Result<(), String> {
    let printer_list = safe_get_printers();

    // If no printers are connected
    if printer_list.is_empty() {
        println!("❌ No printers available");
        let _ = window.emit("log_event", "❌ No printers available");
        return Err("No printers available".to_string());
    }

    // Select the first available printer
    let selected = &printer_list[0];

    println!("🖨️ Printing to: {}", selected.name);
    let _ = window.emit("log_event", format!("🖨️ Printing to: {}", selected.name));

    // printers 1.2.0 uses print_file method
    // For raw content, we write to a temp file first
    let temp_path = std::env::temp_dir().join("receipt_temp.txt");
    
    if let Err(e) = std::fs::write(&temp_path, &content) {
        println!("❌ Failed to write temp file: {:?}", e);
        let _ = window.emit("log_event", format!("❌ Failed to write temp file: {:?}", e));
        return Err(format!("Failed to write temp file: {:?}", e));
    }

    // Send the print job using print_file
    let options = PrinterJobOptions {
        name: Some("Receipt"),
        raw_properties: &[],
    };
    match selected.print_file(temp_path.to_str().unwrap_or(""), options) {
        Ok(_) => {
            println!("✅ Printing succeeded");
            let _ = window.emit("log_event", "✅ Printing succeeded".to_string());
            // Clean up temp file
            let _ = std::fs::remove_file(&temp_path);
            Ok(())
        }
        Err(e) => {
            println!("❌ Printing failed: {:?}", e);
            let _ = window.emit("log_event", format!("❌ Printing failed: {:?}", e));
            // Clean up temp file
            let _ = std::fs::remove_file(&temp_path);
            Err(format!("Printing failed: {:?}", e))
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_printers, print_receipt])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
