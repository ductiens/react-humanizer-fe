import { useState } from "react";
import { humanizeService } from "../services/api";
import { useAppStore } from "../store";
import { API_BASE_URL } from "../constants";

export const useHumanize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const store = useAppStore();

  const humanize = async () => {
    if (!store.inputText.trim()) {
      setError("Please provide text to humanize");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setStreamText("");
    setError(null);
    setHasStarted(true);
    store.clearResult();

    try {
      const token = store.token;
      let headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "");
      const response = await fetch(`${cleanBaseUrl}/humanize/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: store.inputText,
          style: store.style,
          intensity_level: store.intensity_level,
          language: store.language,
          simulate_student: store.simulateStudent,
        }),
        // Do NOT set credentials: 'include' - backend uses allow_origins=* which is incompatible
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from the server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamData = "";
      let leftover = ""; // Buffer for fragmented chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = leftover + decoder.decode(value, { stream: true });
        const events = chunkStr.split("\n\n");

        // The last element might be incomplete; save it for the next read
        leftover = events.pop() || "";

        for (const event of events) {
          if (event.startsWith("data: ")) {
            const raw = event.substring(6).trim();
            if (!raw) continue;
            let data: any;
            try {
              data = JSON.parse(raw);
            } catch {
              // Non-JSON SSE data (e.g. RetryError string from tenacity) - log and skip
              console.warn("Skipping non-JSON SSE chunk:", raw.substring(0, 120));
              continue;
            }
            if (data.type === "progress") setProgress(data.progress);
            if (data.type === "chunk") {
              streamData += (streamData ? "\n\n" : "") + data.text;
              setStreamText(streamData);
            }
            if (data.type === "complete") {
              store.setResult({
                original_text: store.inputText,
                humanized_text: data.humanized_text,
                history_id: data.history_id,
              });
              setProgress(100);
            }
            if (data.type === "error") {
              throw new Error(data.detail || "Server error");
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while humanizing the text.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocx = async (historyId: string) => {
    try {
      if (!historyId) {
        alert("Lỗi: Không thể tải file. Văn bản chưa được lưu vào Database (Có thể do lỗi mạng hoặc cấu hình DB).");
        return;
      }
      await humanizeService.downloadDocx(historyId, `ai-humanized-${historyId.slice(-6)}.docx`);
    } catch (err) {
      console.error("Failed to download document:", err);
    }
  };

  return { humanize, downloadDocx, isLoading, progress, streamText, error, hasStarted };
};
