export interface HumanizeRequest {
  text: string;
  style: string;
  intensity_level: string;
  language: string;
}

export interface HumanizeResponse {
  original_text: string;
  humanized_text: string;
  history_id: string;
}

export interface FileUploadResponse {
  text: string;
  filename: string;
}

export interface HistoryItem {
  id: string;
  original_text: string;
  humanized_text: string;
  style: string;
  intensity_level: string;
  language: string;
  created_at: string;
  
  // Legacy fields
  input_text?: string;
  output_text?: string;
  settings?: any;
}
