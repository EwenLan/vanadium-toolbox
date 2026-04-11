use log::{error, info};
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
pub async fn read_config() -> Result<Config, String> {
    let config_path = get_config_path();
    info!("Reading config from: {:?}", config_path);
    
    if !config_path.exists() {
        info!("Config file does not exist, using default config");
        return Ok(Config::default());
    }
    
    let config = read_config_from_file(&config_path)?;
    info!("Config read successfully: {:?}", config);
    Ok(config)
}

fn read_config_from_file(config_path: &PathBuf) -> Result<Config, String> {
    let content = fs::read_to_string(config_path)
        .map_err(|e| {
            error!("Failed to read config file: {}", e);
            format!("Failed to read config file: {}", e)
        })?;
    
    serde_json::from_str(&content)
        .map_err(|e| {
            error!("Failed to parse config file: {}", e);
            format!("Failed to parse config file: {}", e)
        })
}

#[tauri::command]
pub async fn write_config(config: Config) -> Result<(), String> {
    let config_path = get_config_path();
    info!("Writing config to: {:?}", config_path);
    info!("Config content: {:?}", config);
    
    write_config_to_file(&config_path, &config)?;
    info!("Config written successfully");
    Ok(())
}

fn write_config_to_file(config_path: &PathBuf, config: &Config) -> Result<(), String> {
    let content = serde_json::to_string_pretty(config)
        .map_err(|e| {
            error!("Failed to serialize config: {}", e);
            format!("Failed to serialize config: {}", e)
        })?;
    
    fs::write(config_path, content)
        .map_err(|e| {
            error!("Failed to write config file: {}", e);
            format!("Failed to write config file: {}", e)
        })
}

fn get_config_path() -> PathBuf {
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    info!("Current directory: {:?}", current_dir);
    let config_path = current_dir.join("config.json");
    info!("Config file path: {:?}", config_path);
    config_path
}
