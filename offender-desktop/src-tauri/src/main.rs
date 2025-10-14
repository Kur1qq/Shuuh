use tauri::{Manager, async_runtime::spawn, command};
use std::process::{Command, Stdio};

#[command]
fn start_server() {
  spawn(async move {
    let _ = Command::new("node")
      .arg("./server/server.js")
      .stdout(Stdio::null())
      .stderr(Stdio::null())
      .spawn();
  });
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![start_server])
    .run(tauri::generate_context!())
    .expect("Tauri run failed");
}
