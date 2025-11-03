import { AppData } from './types';

export async function fetchData(scriptUrl: string): Promise<AppData> {
  const response = await fetch(scriptUrl);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function saveData(scriptUrl:string, data: AppData): Promise<void> {
  const response = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'text/plain;charset=utf-t', // Apps Script web apps handle POST data as text
    },
    body: JSON.stringify(data),
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to save data: ${response.statusText}`);
  }
  
  // The response from a POST request to a simple Apps Script web app is often a redirect
  // or a simple text response. We don't need to parse it as JSON here.
}
