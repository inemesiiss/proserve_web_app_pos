use tauri::{command, Window};
use tauri::Emitter;
use printers::common::base::job::PrinterJobOptions;
use printers::get_printers;

#[command]
fn list_printers() -> Result<Vec<String>, String> {
    let printer_list = get_printers();
    let names: Vec<String> = printer_list.iter().map(|p| p.name.clone()).collect();
    Ok(names)
}

// #[command]
// fn print_receipt(window: Window, printer_name: String, content: String) -> Result<(), String> {
//     let printers = get_printers();

//     // Check if the selected printer is available
//     if !printers.iter().any(|p| p.name == printer_name) {
//         let _ = window.emit("log_event", format!("❌ Printer '{}' not available", printer_name));
//         println!("❌ Printer '{}' not available", printer_name);
//         return Err(format!("Printer '{}' not available", printer_name));
//     }

//     let selected = printers.into_iter().find(|p| p.name == printer_name).unwrap();

//     println!("🖨️ Printing to: {}", printer_name);
//     let _ = window.emit("log_event", format!("🖨️ Printing to: {}", printer_name));

//     let options = PrinterJobOptions {
//         name: Some("Receipt Print Job"),
//         raw_properties: &[],
//     };

//     match selected.print(content.as_bytes(), options) {
//         Ok(_) => {
//             println!("✅ Printing succeeded");
//             let _ = window.emit("log_event", "✅ Printing succeeded".to_string());
//             Ok(())
//         }
//         Err(e) => {
//             println!("❌ Printing failed: {:?}", e);
//             let _ = window.emit("log_event", format!("❌ Printing failed: {:?}", e));
//             Err(format!("Printing failed: {:?}", e))
//         }
//     }
// }


#[command]
fn print_receipt(window: Window, content: String) -> Result<(), String> {
    let printers = get_printers();

    // If no printers are connected
    if printers.is_empty() {
        println!("❌ No printers available");
        let _ = window.emit("log_event", "❌ No printers available");
        return Err("No printers available".to_string());
    }

    // Select the first available printer
    let selected = &printers[0];

    println!("🖨️ Printing to: {}", selected.name);
    let _ = window.emit("log_event", format!("🖨️ Printing to: {}", selected.name));

    // PrinterJobOptions for printers 2.2.0
    let options = PrinterJobOptions {
        name: Some("Receipt Print Job"),
        raw_properties: &[],
    };

    // Send the print job
    match selected.print(content.as_bytes(), options) {
        Ok(_) => {
            println!("✅ Printing succeeded");
            let _ = window.emit("log_event", "✅ Printing succeeded".to_string());
            Ok(())
        }
        Err(e) => {
            println!("❌ Printing failed: {:?}", e);
            let _ = window.emit("log_event", format!("❌ Printing failed: {:?}", e));
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
