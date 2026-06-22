import { API_CONFIG } from '../config/apiConfig';

const BASE_URL = API_CONFIG.BASE_URL;

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const adminService = {
  async getCompanies(token: string) {
    const response = await fetch(`${BASE_URL}/admin/companies`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async getCompanyDetails(companyId: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/companies/${companyId}`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async addTradie(companyId: string, data: any, token: string) {
    const response = await fetch(`${BASE_URL}/admin/companies/${companyId}/tradies`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async allocateDid(companyId: string, data: any, token: string) {
    const response = await fetch(`${BASE_URL}/admin/companies/${companyId}/dids`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async remapDid(didId: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/dids/${didId}/remap`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ didId }),
    });
    return handleResponse(response);
  },

  async unmapDid(didId: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/dids/${didId}/unmap`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async renewDid(didId: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/dids/${didId}/renew`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ didId }),
    });
    return handleResponse(response);
  },
  async deleteCompany(companyId: string, token: string) {
    const response = await fetch(`${BASE_URL}/admin/companies/${companyId}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

