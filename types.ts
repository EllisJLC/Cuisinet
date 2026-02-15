
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

export interface ShoppingItemCost {
  itemName: string;
  price: string;
  notes: string;
}

export interface StoreShoppingComparison {
  storeName: string;
  items: ShoppingItemCost[];
  totalCost: string;
  isLowestPrice: boolean;
}

export interface SearchResult {
  produce: ProduceItem[];
  stores: Store[];
  summary: string;
  sources: GroundingSource[];
  searchEntryPoint?: string;
  shoppingComparison?: StoreShoppingComparison[];
}

export interface LocationOption {
  city: string;
  country: string;
}
