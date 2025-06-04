import PropertyPage from "@/components/property/PropertyPage";

const API_BASE_URL = "https://listd-restapi-dev.up.railway.app/api";

type Params = {
  location: string;
  property: string;
  type: string;
};


const propertyMapping: Record<string, string> = {
  'condominium': '/v1/condominiums',
  'house': '/v1/house-and-lots',
  'warehouse': '/v1/warehouses',
  'land': '/v1/vacant-lots',
  'lot': '/v1/vacant-lots'
};

async function fetchProperties(location: string, property: string, type: string) {

  const searchParams = new URLSearchParams();
  
  if (location) {
    searchParams.append('search', location);
  }

  if (property) {
    searchParams.append('property', property);
  }

  if (type) {
    searchParams.append('type', type);
  }

  const url = `${API_BASE_URL}${propertyMapping[property]}?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;


 
}

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const { location, property, type } = await searchParams;
  
  console.log('Search parameters:', { location, property, type });
  
  // Fetch properties based on search parameters
  const propertyResults = await fetchProperties(location, property, type);
  
  console.log('Property fetch results:', propertyResults);

  return <PropertyPage />;
}
