const BASE_URL = "https://editn.in/API/RampSurvey";

export interface LoginResponse {
  status: boolean;
  message: string;
  data?: { name: string; username: string };
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(
    `${BASE_URL}/GetUserLogin?UserName=${encodeURIComponent(username)}&UserPassword=${encodeURIComponent(password)}`,
    { mode: "cors" }
  );
  return response.json();
};

export const testConnection = async (): Promise<unknown> => {
  const response = await fetch(`${BASE_URL}/Test`);
  if (!response.ok) throw new Error("Test request failed");
  return response.json();
};

export interface District {
  masterDataId: string;
  masterDataName: string;
}

export interface DistrictResponse {
  status: boolean;
  message: string;
  data: District[];
}

export const fetchDistricts = async (): Promise<District[]> => {
  const response = await fetch(`${BASE_URL}/GetDistrictMaster`);
  if (!response.ok) throw new Error("Failed to fetch districts");
  const result: DistrictResponse = await response.json();
  return result.data;
};