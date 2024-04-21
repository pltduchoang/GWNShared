// root/frontend/app/utils/fetchWithTimeout.js
async function FetchWithTimeout(resource, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
    return response;
  }

export default FetchWithTimeout;