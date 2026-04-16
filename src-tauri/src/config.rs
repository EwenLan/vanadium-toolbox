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

#[derive(Debug, Serialize, Deserialize)]
pub struct ExternalProgramParameter {
    pub name: String,
    pub label: String,
    pub type_: String, // 使用type_避免与Rust关键字冲突
    pub required: bool,
    pub default: Option<serde_json::Value>,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlatformArgs {
    #[serde(flatten)]
    pub args: std::collections::HashMap<String, Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExternalProgram {
    pub id: String,
    pub name: String,
    pub path: String,
    pub description: String,
    pub parameters: Vec<ExternalProgramParameter>,
    pub platform_args: Option<PlatformArgs>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExternalProgramsConfig {
    pub programs: Vec<ExternalProgram>,
}

impl Default for ExternalProgramsConfig {
    fn default() -> Self {
        Self {
            programs: vec![
                ExternalProgram {
                    id: "md5sum".to_string(),
                    name: "MD5 校验".to_string(),
                    path: "md5sum".to_string(),
                    description: "计算文件或字符串的 MD5 哈希值".to_string(),
                    parameters: vec![
                        ExternalProgramParameter {
                            name: "input".to_string(),
                            label: "输入".to_string(),
                            type_: "string".to_string(),
                            required: true,
                            default: None,
                            description: "要计算 MD5 的字符串或文件路径".to_string(),
                        },
                    ],
                    platform_args: None,
                },
                ExternalProgram {
                    id: "echo".to_string(),
                    name: "Echo 命令".to_string(),
                    path: "echo".to_string(),
                    description: "输出指定的字符串".to_string(),
                    parameters: vec![
                        ExternalProgramParameter {
                            name: "message".to_string(),
                            label: "消息".to_string(),
                            type_: "string".to_string(),
                            required: true,
                            default: None,
                            description: "要输出的消息".to_string(),
                        },
                    ],
                    platform_args: None,
                },
                ExternalProgram {
                    id: "ping".to_string(),
                    name: "Ping 测试".to_string(),
                    path: "ping".to_string(),
                    description: "测试网络连接".to_string(),
                    parameters: vec![
                        ExternalProgramParameter {
                            name: "host".to_string(),
                            label: "主机".to_string(),
                            type_: "string".to_string(),
                            required: true,
                            default: None,
                            description: "要 ping 的主机地址".to_string(),
                        },
                        ExternalProgramParameter {
                            name: "count".to_string(),
                            label: "次数".to_string(),
                            type_: "number".to_string(),
                            required: false,
                            default: Some(serde_json::Value::Number(4.into())),
                            description: "ping 的次数".to_string(),
                        },
                    ],
                    platform_args: Some(PlatformArgs {
                        args: vec![
                            ("any".to_string(), vec!["-n".to_string(), "{count}".to_string(), "{host}".to_string()]),
                            ("win32".to_string(), vec!["-n".to_string(), "{count}".to_string(), "{host}".to_string()]),
                            ("darwin".to_string(), vec!["-c".to_string(), "{count}".to_string(), "{host}".to_string()]),
                            ("linux".to_string(), vec!["-c".to_string(), "{count}".to_string(), "{host}".to_string()]),
                        ].into_iter().collect(),
                    }),
                },
            ],
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

fn get_external_programs_config_path() -> PathBuf {
    let current_dir = std::env::current_dir().expect("Failed to get current directory");
    info!("Current directory: {:?}", current_dir);
    let config_path = current_dir.join("external-programs.json");
    info!("External programs config file path: {:?}", config_path);
    config_path
}

#[tauri::command]
pub async fn read_external_programs_config() -> Result<ExternalProgramsConfig, String> {
    let config_path = get_external_programs_config_path();
    info!("Reading external programs config from: {:?}", config_path);
    
    if !config_path.exists() {
        info!("External programs config file does not exist, using default config");
        // 生成默认配置文件
        let default_config = ExternalProgramsConfig::default();
        write_external_programs_config_to_file(&config_path, &default_config)?;
        return Ok(default_config);
    }
    
    let config = read_external_programs_config_from_file(&config_path)?;
    info!("External programs config read successfully: {} programs", config.programs.len());
    Ok(config)
}

fn read_external_programs_config_from_file(config_path: &PathBuf) -> Result<ExternalProgramsConfig, String> {
    let content = fs::read_to_string(config_path)
        .map_err(|e| {
            error!("Failed to read external programs config file: {}", e);
            format!("Failed to read external programs config file: {}", e)
        })?;
    
    serde_json::from_str(&content)
        .map_err(|e| {
            error!("Failed to parse external programs config file: {}", e);
            format!("Failed to parse external programs config file: {}", e)
        })
}

fn write_external_programs_config_to_file(config_path: &PathBuf, config: &ExternalProgramsConfig) -> Result<(), String> {
    let content = serde_json::to_string_pretty(config)
        .map_err(|e| {
            error!("Failed to serialize external programs config: {}", e);
            format!("Failed to serialize external programs config: {}", e)
        })?;
    
    fs::write(config_path, content)
        .map_err(|e| {
            error!("Failed to write external programs config file: {}", e);
            format!("Failed to write external programs config file: {}", e)
        })
}

#[tauri::command]
pub fn get_platform() -> String {
    let os = std::env::consts::OS;
    info!("Current OS: {}", os);
    let platform = match os {
        "windows" => "win32",
        "macos" => "darwin",
        "linux" => "linux",
        other => other,
    };
    info!("Mapped platform: {}", platform);
    platform.to_string()
}
