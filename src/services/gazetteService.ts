import { GazetteNotice } from "../data";

export async function processGazetteNotice(rawText: string, countyId: string): Promise<Partial<GazetteNotice>> {
  try {
    const response = await fetch('/api/process-gazette', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawText, countyId }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ...result,
      countyId,
      rawText
    };
  } catch (error) {
    console.error("Gazette Processing Error:", error);
    throw error;
  }
}

// Mock function to "poll" for new notices
export async function fetchRecentGazetteNotifications(): Promise<string[]> {
  // In a real app, this would hit an RSS feed or scraper
  return [
    "GAZETTE NOTICE NO. 5421: NAIROBI CITY COUNTY SUPPLEMENTARY APPROPRIATION ACT, 2024. Notice is given that the Nairobi City County Assembly has approved reallocation of KES 200M from the Emergency Fund to the Office of the Governor for 'Strategic Communication' and 'International Travel' for the remainder of the 2023/24 financial year.",
    "GAZETTE NOTICE NO. 5502: MOMBASA COUNTY FINANCE ACT AMENDMENT. The Mombasa County Executive Committee for Finance announces a temporary 5% increase in parking fees within the CBD to fund the 'Urban Greening' project starting June 1st."
  ];
}
