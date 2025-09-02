import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SocialLink, ProfileData } from '../App';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-af6f5999`;

console.log('DataService initialized with:');
console.log('- Project ID:', projectId);
console.log('- API Base:', API_BASE);
console.log('- Public Key:', publicAnonKey ? 'Present' : 'Missing');

class DataService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`Making request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error(`Network error for ${url}:`, error);
      throw error;
    }
  }

  // Health check method for debugging
  async healthCheck() {
    return this.request('/health');
  }

  // Profile methods
  async getProfile(): Promise<ProfileData> {
    return this.request('/profile');
  }

  async updateProfile(profile: ProfileData): Promise<void> {
    await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Links methods
  async getLinks(): Promise<SocialLink[]> {
    return this.request('/links');
  }

  async addLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(link),
    });
  }

  async updateLink(id: string, link: Omit<SocialLink, 'id'>): Promise<void> {
    await this.request(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(link),
    });
  }

  async deleteLink(id: string): Promise<void> {
    await this.request(`/links/${id}`, {
      method: 'DELETE',
    });
  }
}

export const dataService = new DataService();