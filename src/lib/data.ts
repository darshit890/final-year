export interface Article {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  author: string;
  channel: string;
  category: string;
  newsletter: string;
  topic: string;
  created_at?: string;
  updated_at?: string;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
  
  