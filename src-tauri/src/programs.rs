use tokio::process::Command;
use std::process::Stdio;
use serde::{Serialize, Deserialize};
use tokio::io::{AsyncBufReadExt, BufReader};
use tauri::Emitter;

#[derive(Debug, Serialize, Deserialize)]
pub struct ProgramOutput {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OutputChunk {
    pub stdout: String,
    pub stderr: String,
    pub done: bool,
    pub success: bool,
}

#[tauri::command]
pub async fn execute_program(program: String, arguments: Vec<String>, window: tauri::Window) -> Result<ProgramOutput, String> {
    println!("Executing program: {} with args: {:?}", program, arguments);
    
    // 启动进程
    let mut child = Command::new(program)
        .args(arguments)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            println!("Failed to execute program: {}", e);
            format!("Failed to execute program: {}", e)
        })?;
    
    // 收集输出
    let mut stdout = String::new();
    let mut stderr = String::new();
    let mut success = true;
    
    // 读取标准输出
    if let Some(stdout_reader) = child.stdout.take() {
        let mut reader = BufReader::new(stdout_reader);
        let mut line = String::new();
        while reader.read_line(&mut line).await.is_ok() && !line.is_empty() {
            stdout.push_str(&line);
            // 发送输出事件
            window.emit("program-output", OutputChunk {
                stdout: line.trim_end().to_string(),
                stderr: "".to_string(),
                done: false,
                success: false,
            }).unwrap();
            line.clear();
        }
    }
    
    // 读取标准错误
    if let Some(stderr_reader) = child.stderr.take() {
        let mut reader = BufReader::new(stderr_reader);
        let mut line = String::new();
        while reader.read_line(&mut line).await.is_ok() && !line.is_empty() {
            stderr.push_str(&line);
            // 发送输出事件
            window.emit("program-output", OutputChunk {
                stdout: "".to_string(),
                stderr: line.trim_end().to_string(),
                done: false,
                success: false,
            }).unwrap();
            line.clear();
        }
    }
    
    // 等待进程完成
    let status = child.wait().await
        .map_err(|e| format!("等待进程失败: {}", e))?;
    success = status.success();
    
    // 发送完成事件
    window.emit("program-output", OutputChunk {
        stdout: stdout.clone(),
        stderr: stderr.clone(),
        done: true,
        success: success,
    }).unwrap();
    
    println!("Program executed with status: {}", success);
    println!("Stdout: '{}'\nStderr: '{}'", stdout, stderr);
    
    Ok(ProgramOutput {
        success: success,
        stdout,
        stderr,
    })
}
