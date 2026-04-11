// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

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
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn read_config() -> Result<Config, String> {
    let config_path = get_config_path();
    if config_path.exists() {
        match fs::read_to_string(&config_path) {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(config) => Ok(config),
                    Err(e) => Err(format!("Failed to parse config file: {}", e)),
                }
            }
            Err(e) => Err(format!("Failed to read config file: {}", e)),
        }
    } else {
        // Return default config if file doesn't exist
        Ok(Config::default())
    }
}

#[tauri::command]
async fn write_config(config: Config) -> Result<(), String> {
    let config_path = get_config_path();
    match serde_json::to_string_pretty(&config) {
        Ok(content) => {
            match fs::write(&config_path, content) {
                Ok(_) => Ok(()),
                Err(e) => Err(format!("Failed to write config file: {}", e)),
            }
        }
        Err(e) => Err(format!("Failed to serialize config: {}", e)),
    }
}

fn get_config_path() -> PathBuf {
    // Get the directory of the executable
    let exe_path = std::env::current_exe().expect("Failed to get executable path");
    let exe_dir = exe_path.parent().expect("Failed to get executable directory");
    println!("Executable directory: {:?}", exe_dir);
    let config_path = exe_dir.join("config.json");
    println!("Config file path: {:?}", config_path);
    config_path
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, read_config, write_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
