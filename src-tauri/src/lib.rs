// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use log::{debug, error, info, trace, warn};
use crate::logging::init_logger;
mod logging;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub theme: String,
    pub language: String,
    pub window_width: u32,
    pub window_height: u32,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            language: "zh-CN".to_string(),
            window_width: 800,
            window_height: 600,
        }
    }
}

#[tauri::command]
async fn read_config() -> Result<Config, String> {
    let config_path = get_config_path();
    info!("Reading config from: {:?}", config_path);
    if config_path.exists() {
        match fs::read_to_string(&config_path) {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(config) => {
                        info!("Config read successfully: {:?}", config);
                        Ok(config)
                    }
                    Err(e) => {
                        error!("Failed to parse config file: {}", e);
                        Err(format!("Failed to parse config file: {}", e))
                    }
                }
            }
            Err(e) => {
                error!("Failed to read config file: {}", e);
                Err(format!("Failed to read config file: {}", e))
            }
        }
    } else {
        info!("Config file does not exist, using default config");
        // Return default config if file doesn't exist
        Ok(Config::default())
    }
}

#[tauri::command]
async fn write_config(config: Config) -> Result<(), String> {
    let config_path = get_config_path();
    info!("Writing config to: {:?}", config_path);
    info!("Config content: {:?}", config);
    match serde_json::to_string_pretty(&config) {
        Ok(content) => {
            match fs::write(&config_path, content) {
                Ok(_) => {
                    info!("Config written successfully");
                    Ok(())
                }
                Err(e) => {
                    error!("Failed to write config file: {}", e);
                    Err(format!("Failed to write config file: {}", e))
                }
            }
        }
        Err(e) => {
            error!("Failed to serialize config: {}", e);
            Err(format!("Failed to serialize config: {}", e))
        }
    }
}

fn get_config_path() -> PathBuf {
    // Get current directory
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    info!("Current directory: {:?}", current_dir);
    let config_path = current_dir.join("config.json");
    info!("Config file path: {:?}", config_path);
    config_path
}

#[tauri::command]
async fn log_message(level: String, message: String) -> Result<(), String> {
    match level.as_str() {
        "trace" => trace!("{}", message),
        "debug" => debug!("{}", message),
        "info" => info!("{}", message),
        "warn" => warn!("{}", message),
        "error" => error!("{}", message),
        _ => info!("{}", message),
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize log
    init_logger().unwrap();

    info!("Starting vanadium-toolbox application");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_config, write_config, log_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
