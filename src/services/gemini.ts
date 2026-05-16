export async function askWatchdog(question: string, countyId?: string, docId?: string) {
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, countyId, docId }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.answer || "I couldn't process that request at the moment. Please try again.";
  } catch (error) {
    console.error("Watchdog Chat Error:", error);
    throw error;
  }
}
