mod config;
mod logging;
mod programs;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::read_config,
            config::write_config,
            logging::log_message,
            programs::execute_program
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
