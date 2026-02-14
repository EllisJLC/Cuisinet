
export interface ProduceItem {
  name: string;
  priceEstimate: string;
  seasonality: string;
  reason: string;
}

export interface Store {
  name: string;
  category: 'Supermarket' | 'Local Market' | 'Discount Store';
  highlights: string;
  accessibility: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  produce: ProduceItem[];
  stores: Store[];
  summary: string;
  sources: GroundingSource[];
  searchEntryPoint?: string;
}

export interface LocationOption {
  city: string;
  country: string;
}
