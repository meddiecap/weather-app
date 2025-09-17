// utils/ipLocationHandler.ts
export interface IpApiResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  // You can add more fields if needed
}

export async function ipLocationHandler(ip: string): Promise<IpApiResponse> {
  console.log("Fetching IP location for:", ip)
  return await $fetch<IpApiResponse>(`http://ip-api.com/json/${ip}`);
}