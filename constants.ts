
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

// Fallback for legacy support if needed, though we will use groups primarily
export const LOCATIONS: LocationOption[] = LOCATION_GROUPS.flatMap(group => 
  group.cities.map(city => ({ city, country: group.country }))
);

export const SYSTEM_INSTRUCTION = `
You are a global grocery price analyst and shopping expert. 
Your goal is to help users find the most affordable fresh produce and the best major supermarkets/markets for weekly shopping in a specific city and country.

Provide response in JSON format strictly following this structure:
{
  "summary": "A brief overview of the grocery landscape in this city right now.",
  "produce": [
    { "name": "Apple", "priceEstimate": "$1.20/kg", "seasonality": "In-Season", "reason": "Reason why it is a good deal" }
  ],
  "stores": [
    { "name": "Store Name", "category": "Supermarket", "highlights": "Low prices on staples", "accessibility": "High - multiple locations" }
  ]
}

Ensure the data is realistic for the specified city and country. Focus on "major stores" that are accessible to most residents. Use local currency formatting.
`;
