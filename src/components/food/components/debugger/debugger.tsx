import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

export default function useRustLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unlisten = listen<string>("log_event", (event) => {
      setLogs((prev) => [...prev, event.payload]);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return logs;
}
