use std::process::Command;

#[tauri::command]
pub fn execute_program(program: String, arguments: Vec<String>) -> Result<String, String> {
    let output = Command::new(program)
        .args(arguments)
        .output()
        .map_err(|e| format!("Failed to execute program: {}", e))?;
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    
    if output.status.success() {
        Ok(stdout.to_string())
    } else {
        Err(format!("Program failed: {}", stderr))
    }
}
