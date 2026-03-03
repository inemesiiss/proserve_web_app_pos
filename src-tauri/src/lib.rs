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

    // If no printers are connected
    if printer_list.is_empty() {
        println!("❌ No printers available");
        let _ = window.emit("log_event", "❌ No printers available");
        return Err("No printers available".to_string());
    }

    // Find the selected printer by name, fall back to first printer
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

    // Wrap plain text content in minimal HTML with monospace pre formatting
    // This ensures the thermal printer renders it correctly
    let html_content = format!(
        r#"<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {{ size: 80mm auto; margin: 0; }}
body {{ margin: 0; padding: 2mm; font-family: 'Courier New', monospace; font-size: 10px; }}
pre {{ margin: 0; white-space: pre; font-family: 'Courier New', monospace; font-size: 10px; line-height: 1.3; }}
</style>
</head>
<body><pre>{}</pre></body>
</html>"#,
        content
    );

    // Write to temp file
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let temp_path = std::env::temp_dir().join(format!("receipt_{}.html", timestamp));
    
    if let Err(e) = std::fs::write(&temp_path, &html_content) {
        println!("❌ Failed to write receipt file: {:?}", e);
        let _ = window.emit("log_event", format!("❌ Failed to write receipt file: {:?}", e));
        return Err(format!("Failed to write receipt file: {:?}", e));
    }

    println!("📝 Receipt file created at: {:?}", temp_path);
    println!("📄 Content length: {} chars", content.len());

    // Send the print job using print_file
    let options = PrinterJobOptions {
        name: Some("Receipt"),
        raw_properties: &[],
    };
    match selected.print_file(temp_path.to_str().unwrap_or(""), options) {
        Ok(_) => {
            println!("✅ Printing succeeded to '{}'", selected.name);
            let _ = window.emit("log_event", format!("✅ Printing succeeded to '{}'", selected.name));
            // Clean up temp file after a delay
            std::thread::sleep(std::time::Duration::from_millis(500));
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
