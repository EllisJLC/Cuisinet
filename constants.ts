
import { LocationOption } from './types';

export interface CountryGroup {
  country: string;
  cities: string[];
}

export const LOCATION_GROUPS: CountryGroup[] = [
  { country: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh'] },
  { country: 'USA', cities: ['New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Austin', 'Seattle'] },
  { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
  { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  { country: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'] },
  { country: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
  { country: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
  { country: 'Singapore', cities: ['Singapore'] },
  { country: 'UAE', cities: ['Dubai', 'Abu Dhabi'] },
  { country: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { country: 'Brazil', cities: ['Sao Paulo', 'Rio de Janeiro'] },
  { country: 'South Africa', cities: ['Cape Town', 'Johannesburg'] },
  { country: 'Mexico', cities: ['Mexico City', 'Guadalajara'] },
  { country: 'Italy', cities: ['Rome', 'Milan', 'Florence'] },
  { country: 'Spain', cities: ['Madrid', 'Barcelona'] }
];

export const LOCATIONS: LocationOption[] = LOCATION_GROUPS.flatMap(group => 
  group.cities.map(city => ({ city, country: group.country }))
);

export const SYSTEM_INSTRUCTION = `
You are a global grocery price analyst. 
Your goal is to help users find the most affordable fresh produce and compare store prices in a specific city/country.

If provided with a "shopping list", research current local prices for those items (including quantities) at major supermarkets in that specific location.

Provide response in JSON format strictly following this structure:
{
  "summary": "Overview of findings.",
  "produce": [
    { "name": "Item", "priceEstimate": "$X", "seasonality": "Status", "reason": "Deal info" }
  ],
  "stores": [
    { "name": "Store", "category": "Type", "highlights": "Pros", "accessibility": "Location info" }
  ],
  "shoppingComparison": [
    {
      "storeName": "Store A",
      "items": [{ "itemName": "Apples 2kg", "price": "$4.00", "notes": "On sale" }],
      "totalCost": "$15.50",
      "isLowestPrice": true
    }
  ]
}

Ensure formatting is realistic for the city/country. Focus on major, accessible stores. Use local currency.
`;
