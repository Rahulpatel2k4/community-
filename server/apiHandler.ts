import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { IncomingMessage, ServerResponse } from "http";

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", (err) => reject(err));
  });
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<boolean> {
  if (!url.startsWith("/api/")) return false;

  res.setHeader("Content-Type", "application/json");

  // Endpoint: Health check / Status
  if (url === "/api/health" && req.method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return true;
  }

  // Endpoint: Optimize Community Route & Bulk Batching (Gemini 3.1 Pro Preview with HIGH Thinking Mode)
  if (url === "/api/optimize-community-route" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const { neighborhood, orders, slots, constraints } = data;

      const prompt = `You are the Lead Logistics & Community Collective Intelligence Engine for community (a Blinkit community group-buying platform for residential societies).

Neighborhood Information:
- Community Name: ${neighborhood?.name || "Greenwood Palms Residential Society"}
- Total Households in Pool: ${neighborhood?.households || 28}
- Total Weight Pooled: ${neighborhood?.totalWeightKg || 184} kg
- Cluster Points: ${JSON.stringify(neighborhood?.clusters || [
        { name: "Tower A (Flats 101-904)", orders: 9, weightKg: 58, perishableRatio: "45%" },
        { name: "Tower B (Flats 101-904)", orders: 7, weightKg: 42, perishableRatio: "60%" },
        { name: "Tower C (Flats 101-904)", orders: 8, weightKg: 62, perishableRatio: "30%" },
        { name: "Clubhouse / Captain Drop Hub", orders: 4, weightKg: 22, perishableRatio: "20%" },
      ])}
- Target Delivery Window: ${slots?.selected || "Today 6:00 PM - 7:15 PM"}
- Additional User Directives: ${constraints || "Minimize carbon footprint, avoid elevator bottlenecks during peak evening hours, and keep cold-chain fresh vegetables crisp."}

Task:
Perform high-level reasoning to calculate the optimal consolidated delivery itinerary, building sequence, vehicle loading plan, and carbon/cost savings for this neighborhood batch.

Structure your final synthesized output in clear, actionable JSON format with the following keys:
{
  "routeTitle": string,
  "summary": string,
  "totalStops": number,
  "estimatedTimeMinutes": number,
  "co2SavedKg": number,
  "residentSavingsTotal": string,
  "stopSequence": [
    {
      "step": number,
      "location": string,
      "timeWindow": string,
      "orderCount": number,
      "weightKg": number,
      "action": string,
      "elevatorOptimizationTip": string,
      "perishableCare": string
    }
  ],
  "batchPackagingPlan": {
    "reusableCratesNeeded": number,
    "coldBagsNeeded": number,
    "grainSacksConsolidated": number,
    "packagingWasteReducedPct": number
  },
  "communityCaptainBonus": string,
  "recommendations": string[]
}`;

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback intelligent response if no API key is provided
        const simulatedResult = generateSimulatedRoutePlan(neighborhood);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, data: simulatedResult, mode: "fallback" }));
        return true;
      }

      // CRITICAL REQUIREMENT:
      // "You MUST use the gemini-3.1-pro-preview model and set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens."
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert in hyperlocal urban logistics, community group-buying economics (like Pinduoduo & Blinkit dark-store batching), and sustainable routing algorithms. Return your answer as a valid JSON object matching the requested schema.",
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          responseMimeType: "application/json",
        },
      });

      // Extract thinking thoughts if exposed in parts
      let thinkingSteps: string[] = [];
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if ((part as any).thought) {
          thinkingSteps.push(String((part as any).thought));
        }
      }

      let parsedData: any = null;
      try {
        parsedData = JSON.parse(response.text || "{}");
      } catch {
        parsedData = { rawText: response.text };
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        data: parsedData,
        thinkingSummary: thinkingSteps.length > 0 ? thinkingSteps.join("\n\n") : null,
        model: "gemini-3.1-pro-preview",
        thinkingLevel: "HIGH"
      }));
      return true;
    } catch (err: any) {
      console.error("Gemini Route Optimizer Error:", err);
      // Fallback gracefully so UI remains fast and functional
      const simulatedResult = generateSimulatedRoutePlan(null);
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        data: simulatedResult,
        errorNote: err?.message || "Using fallback optimizer engine",
        mode: "fallback"
      }));
      return true;
    }
  }

  // Endpoint: Community Bulk Strategy & Deep Query (Gemini 3.1 Pro Preview with HIGH Thinking Mode)
  if (url === "/api/community-bulk-planner" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const { userQuery, context } = data;

      const prompt = `The user is querying the community (Blinkit community group buying) Optimizer:
User Query: "${userQuery}"

Current Community Context:
- Active Neighborhood: ${context?.neighborhood || "Palm Meadows Residency, Block B"}
- Active Group Pools: Fresh Farm Veggies (82kg unlocked, 35% discount), Seasonal Fruit Crate (44kg unlocked, 25% discount), Premium Basmati & Sona Masoori Rice (120kg master bag split, 40% discount).
- Scheduled Delivery Window: Today 6:00 PM - 7:30 PM (Consolidated Eco-Van).

Instructions:
Perform deep reasoning (thinking) to analyze this request thoroughly. Consider:
1. Unit economics of bulk farm-to-community buying vs instant solo delivery.
2. Neighborhood coordination mechanisms (Tower Captains, Lobby Pickup Lockers, Doorstep runners).
3. Delivery schedule synchronization to avoid peak congestion and ensure farm harvest freshness.
4. Concrete mathematical calculations of wholesale price split and carbon emissions saved.

Provide a thorough, structured, and insightful response with clear sections:
- Executive Summary & Core Strategy
- Deep Quantitative Reasoning (Price breakdowns, kg thresholds, farmer payout vs supermarket margin)
- Neighborhood Schedule & Distribution Blueprint (Timeline & Tower Routing)
- Actionable Next Steps for Community Captains & Residents`;

      const ai = getGeminiClient();
      if (!ai) {
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          analysis: generateSimulatedPlannerResponse(userQuery),
          mode: "fallback"
        }));
        return true;
      }

      // CRITICAL REQUIREMENT:
      // "You MUST use the gemini-3.1-pro-preview model and set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens."
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an authoritative strategic advisor for community group-buying and sustainable urban logistics. You think methodically through supply chain bottlenecks, group psychology, and route optimization.",
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      // Extract thinking steps if present
      let thoughts: string[] = [];
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if ((part as any).thought) {
          thoughts.push(String((part as any).thought));
        }
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        analysis: response.text,
        thinkingProcess: thoughts.length > 0 ? thoughts.join("\n\n") : null,
        model: "gemini-3.1-pro-preview",
        thinkingLevel: "HIGH"
      }));
      return true;
    } catch (err: any) {
      console.error("Gemini Bulk Planner Error:", err);
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        analysis: generateSimulatedPlannerResponse(err?.message || "Plan community bulk ordering"),
        errorNote: err?.message,
        mode: "fallback"
      }));
      return true;
    }
  }

  return false;
}

// Fallback high-fidelity generators when API key is pending or network is restricted
function generateSimulatedRoutePlan(neighborhood: any) {
  const name = neighborhood?.name || "Greenwood Palms Residential Society";
  return {
    routeTitle: `Consolidated Eco-Batch Route • ${name}`,
    summary: `AI has consolidated 28 residential orders into 1 single localized EV delivery run. By grouping deliveries across 3 residential towers between 6:00 PM and 7:15 PM, we eliminate 27 redundant vehicle trips and ensure cold-chain perishables are placed into kitchens within 18 minutes of arrival.`,
    totalStops: 4,
    estimatedTimeMinutes: 52,
    co2SavedKg: 8.4,
    residentSavingsTotal: "₹3,420 (Avg. ₹122 / household)",
    stopSequence: [
      {
        step: 1,
        location: "Central Clubhouse Hub & Smart Lockers",
        timeWindow: "6:00 PM - 6:15 PM",
        orderCount: 6,
        weightKg: 28,
        action: "Deposit pre-labeled locker orders for early evening walkers & gym attendees. Handover Tower C overflow to Captain Ritu.",
        elevatorOptimizationTip: "Zero elevator wait. High efficiency staging area for bulky rice sacks.",
        perishableCare: "Active insulated thermal pods keeping milk and spinach at 4°C."
      },
      {
        step: 2,
        location: "Tower A (Ground + 9 Floors)",
        timeWindow: "6:18 PM - 6:34 PM",
        orderCount: 9,
        weightKg: 58,
        action: "Consolidated service elevator run. Floors: 9th, 7th, 5th, 3rd, 1st (top-down routing saves 7 minutes).",
        elevatorOptimizationTip: "Ascend directly to Floor 9 via service lift, deliver downwards using staircase between adjacent floors.",
        perishableCare: "Reusable breathable jute produce pouches; no single-use plastic."
      },
      {
        step: 3,
        location: "Tower B (Ground + 9 Floors)",
        timeWindow: "6:37 PM - 6:53 PM",
        orderCount: 7,
        weightKg: 44,
        action: "Direct doorstep drop off for flats 802, 604, 501, 403, 301, 102. 2 orders left with Tower B Lobby Concierge.",
        elevatorOptimizationTip: "Even-odd floor batching coordinated with lift dwell timing.",
        perishableCare: "Delivered within 35 minutes of warehouse dispatch."
      },
      {
        step: 4,
        location: "Tower C (Ground + 8 Floors)",
        timeWindow: "6:56 PM - 7:12 PM",
        orderCount: 6,
        weightKg: 54,
        action: "Final delivery leg. Heavy 25kg communal rice split distribution and cold-pressed oil tins.",
        elevatorOptimizationTip: "Trolley deployment from basement ramp parking entrance.",
        perishableCare: "Crate return: 14 empty farm crates reclaimed for tomorrow morning's farm run."
      }
    ],
    batchPackagingPlan: {
      reusableCratesNeeded: 12,
      coldBagsNeeded: 8,
      grainSacksConsolidated: 4,
      packagingWasteReducedPct: 92
    },
    communityCaptainBonus: "₹450 Grocery Credits awarded to Captain Ritu (Tower C)",
    recommendations: [
      "Shift next Tuesday's batch to 6:30 PM to sync with metro commuter arrivals.",
      "Tower B is just 6kg away from unlocking the 40% Tier 4 discount on farm tomatoes.",
      "Consolidating Tower A & B milk deliveries into the 7:00 AM slot will save an additional 1.8 kg CO2."
    ]
  };
}

function generateSimulatedPlannerResponse(query: string) {
  return `# Community Collective Buying & Optimization Plan

### 1. Executive Summary & Core Opportunity
For neighborhood communities, traditional instant delivery apps add 25-45% in dark-store overhead, picking fees, and individual motorcycle courier costs. By pooling neighborhood demand into coordinated **community cycles**, households unlock wholesale farm-gate prices while slashing carbon emissions by up to 88%.

### 2. Tiered Bulk Unlock Architecture
* **Tier 1 (Base - 0 to 15 kg):** Retail quick price (e.g. ₹38/kg for Farm Potatoes).
* **Tier 2 (Neighborhood Tier - 15 to 40 kg):** 18% Bulk Unlock (₹31/kg). Requires ~8 participating flats.
* **Tier 3 (Society Wholesale - 40 to 90 kg):** 32% Super Bulk Unlock (₹25/kg). Sourced directly from peri-urban agricultural mandis.
* **Tier 4 (Mega Hub - 90+ kg):** 44% Direct Farmer Wholesale (₹21/kg). Master sack split with zero packaging overhead.

### 3. Hyperlocal Distribution Schedule Matrix
1. **Morning Fresh Greens Slot (7:00 AM - 8:15 AM):** Harvested at 3:00 AM by local partner farmers, sorted at dark hub by 5:30 AM, single EV van delivery to society lobby before breakfast prep.
2. **Evening Staples & Dinner Batch (6:00 PM - 7:30 PM):** Bulk onions, potatoes, grains, and pantry goods delivered during post-work return hours.
3. **Weekend Master Bag Splitting (Saturday 10:00 AM):** 25kg Basmati and Atta bags split into pre-weighed 5kg eco-totes at the clubhouse.

### 4. Carbon & Financial Impact
- **Financial Savings:** ₹2,800 to ₹4,200 saved per household monthly.
- **Traffic Elimination:** Replaces 42 single-item two-wheeler trips per day with 2 consolidated EV drops.
- **Waste Elimination:** 100% reusable returnable crates with zero polybags.`;
}
