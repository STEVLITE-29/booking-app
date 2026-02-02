import { NextRequest, NextResponse } from "next/server";

// Use server-side env first for API key; fall back to NEXT_PUBLIC if present
const API_KEY =
  process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const API_HOST = "booking-com15.p.rapidapi.com";

const API_KEY_MISSING = !API_KEY;
if (API_KEY_MISSING) {
  console.warn(
    "[Meta API] RAPIDAPI_KEY and NEXT_PUBLIC_RAPIDAPI_KEY are not set. Using fallback data.",
  );
}

const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Fallback exchange rates when API key is missing
const FALLBACK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 145.5,
    AUD: 1.53,
    CAD: 1.36,
    CNY: 7.24,
    INR: 83.12,
    MXN: 17.05,
    BRL: 4.97,
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const baseCurrency = searchParams.get("base_currency") || "USD";

  if (!action) {
    return NextResponse.json(
      { error: "Missing action parameter" },
      { status: 400 },
    );
  }

  // If no API key, return fallback for supported actions
  if (API_KEY_MISSING) {
    console.log(
      `[Meta API] No API key; returning fallback for action: ${action}`,
    );

    if (action === "getExchangeRates") {
      return NextResponse.json(
        {
          rates: FALLBACK_EXCHANGE_RATES[baseCurrency] ||
            FALLBACK_EXCHANGE_RATES.USD || {
              [baseCurrency]: 1,
            },
        },
        { status: 200 },
      );
    }

    if (action === "getLanguages") {
      return NextResponse.json(
        { languages: ["en", "es", "fr", "de", "it", "pt"] },
        { status: 200 },
      );
    }

    if (action === "getCurrency") {
      return NextResponse.json(
        { currencies: ["USD", "EUR", "GBP", "JPY"] },
        { status: 200 },
      );
    }

    // For locationToLatLong, we need to fail gracefully but not throw
    if (action === "locationToLatLong") {
      return NextResponse.json(
        {
          error:
            "API key not configured. Location geocoding unavailable in demo mode.",
        },
        { status: 503 },
      );
    }
  }

  try {
    let url = "";

    switch (action) {
      case "getLanguages":
        url = `https://${API_HOST}/api/v1/meta/getLanguages`;
        break;
      case "getCurrency":
        url = `https://${API_HOST}/api/v1/meta/getCurrency`;
        break;
      case "getExchangeRates":
        url = `https://${API_HOST}/api/v1/meta/getExchangeRates?base_currency=${encodeURIComponent(
          baseCurrency,
        )}`;
        break;
      case "locationToLatLong":
        const query = searchParams.get("query");
        if (!query) {
          return NextResponse.json(
            { error: "Missing query parameter" },
            { status: 400 },
          );
        }
        url = `https://${API_HOST}/api/v1/meta/locationToLatLong?query=${encodeURIComponent(
          query,
        )}`;
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Meta API] ${action} failed: ${response.status} ${response.statusText}`,
        errorText.substring(0, 200),
      );

      // Rate limit fallback for exchange rates
      if (action === "getExchangeRates" && response.status === 429) {
        console.warn("[Meta API] Rate limited, returning fallback rates");
        return NextResponse.json(
          { rates: { [baseCurrency]: 1 } },
          { status: 200 },
        );
      }

      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Meta API] ${action} succeeded`);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Meta API] Error:", errorMessage);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
