#[macro_use]
extern crate lazy_static;

mod config;
mod logging;
mod programs;
use logging::init_logger;

pub fn run() {
    init_logger().unwrap();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::read_config,
            config::write_config,
            config::read_external_programs_config,
            config::get_platform,
            logging::log_message,
            programs::execute_program
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
