// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use log::{info};
use config::{read_config, write_config};
use logging::{log_message, init_logger};
mod logging;
mod config;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize log
    init_logger().unwrap();

    info!("Starting vanadium-toolbox application");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_config, 
            write_config, 
            log_message
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
