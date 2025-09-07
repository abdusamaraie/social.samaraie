import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Simple request logging
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check endpoint
app.get('/make-server-af6f5999/health', (c) => {
  console.log('Health check requested');
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: Deno.env.get('SUPABASE_URL') ? 'set' : 'not set',
      serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'set' : 'not set'
    }
  });
});

// Get profile data
app.get('/make-server-af6f5999/profile', async (c) => {
  try {
    console.log('Getting profile data...');
    const profile = await kv.get('linktree-profile');
    console.log('Profile data retrieved:', profile);
    
    if (!profile) {
      const defaultProfile = {
        name: 'Your Name',
        bio: 'Creator • Developer • Dreamer\nBuilding amazing things on the internet ✨',
        avatar: '👤'
      };
      console.log('Using default profile:', defaultProfile);
      return c.json(defaultProfile);
    }
    return c.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    return c.json({ error: `Failed to get profile: ${error.message}` }, 500);
  }
});

// Update profile data
app.put('/make-server-af6f5999/profile', async (c) => {
  try {
    console.log('Updating profile data...');
    const profileData = await c.req.json();
    console.log('Profile data to update:', profileData);
    
    await kv.set('linktree-profile', profileData);
    console.log('Profile updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: `Failed to update profile: ${error.message}` }, 500);
  }
});

// Get all social links
app.get('/make-server-af6f5999/links', async (c) => {
  try {
    console.log('Getting social links...');
    const links = await kv.get('linktree-links');
    console.log('Links retrieved:', links);
    
    if (!links) {
      const defaultLinks = [
        {
          id: '1',
          title: 'Instagram',
          url: 'https://instagram.com/username',
          icon: '📷',
          color: 'from-pink-500 to-orange-500'
        },
        {
          id: '2',
          title: 'Twitter',
          url: 'https://twitter.com/username',
          icon: '🐦',
          color: 'from-blue-400 to-blue-600'
        },
        {
          id: '3',
          title: 'LinkedIn',
          url: 'https://linkedin.com/in/username',
          icon: '💼',
          color: 'from-blue-600 to-blue-800'
        },
        {
          id: '4',
          title: 'GitHub',
          url: 'https://github.com/username',
          icon: '🔗',
          color: 'from-gray-600 to-gray-800'
        },
        {
          id: '5',
          title: 'YouTube',
          url: 'https://youtube.com/@username',
          icon: '📺',
          color: 'from-red-500 to-red-700'
        },
        {
          id: '6',
          title: 'Website',
          url: 'https://yourwebsite.com',
          icon: '🌐',
          color: 'from-purple-500 to-purple-700'
        }
      ];
      console.log('Using default links, saving to storage...');
      await kv.set('linktree-links', defaultLinks);
      return c.json(defaultLinks);
    }
    return c.json(links);
  } catch (error) {
    console.error('Error getting links:', error);
    return c.json({ error: `Failed to get links: ${error.message}` }, 500);
  }
});

// Add new link
app.post('/make-server-af6f5999/links', async (c) => {
  try {
    console.log('Adding new link...');
    const newLink = await c.req.json();
    console.log('New link data:', newLink);
    
    const existingLinks = await kv.get('linktree-links') || [];
    const linkWithId = { ...newLink, id: Date.now().toString() };
    const updatedLinks = [...existingLinks, linkWithId];
    
    await kv.set('linktree-links', updatedLinks);
    console.log('Link added successfully:', linkWithId);
    return c.json(linkWithId);
  } catch (error) {
    console.error('Error adding link:', error);
    return c.json({ error: `Failed to add link: ${error.message}` }, 500);
  }
});

// Update existing link
app.put('/make-server-af6f5999/links/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('Updating link with ID:', id);
    
    const updatedLinkData = await c.req.json();
    console.log('Updated link data:', updatedLinkData);
    
    const existingLinks = await kv.get('linktree-links') || [];
    const updatedLinks = existingLinks.map((link: any) => 
      link.id === id ? { ...updatedLinkData, id } : link
    );
    
    await kv.set('linktree-links', updatedLinks);
    console.log('Link updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating link:', error);
    return c.json({ error: `Failed to update link: ${error.message}` }, 500);
  }
});

// Delete link
app.delete('/make-server-af6f5999/links/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('Deleting link with ID:', id);
    
    const existingLinks = await kv.get('linktree-links') || [];
    const updatedLinks = existingLinks.filter((link: any) => link.id !== id);
    
    await kv.set('linktree-links', updatedLinks);
    console.log('Link deleted successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return c.json({ error: `Failed to delete link: ${error.message}` }, 500);
  }
});

// Get theme settings
app.get('/make-server-af6f5999/theme', async (c) => {
  try {
    console.log('Getting theme settings...');
    const theme = await kv.get('linktree-theme');
    console.log('Theme settings retrieved:', theme);
    
    if (!theme) {
      const defaultTheme = {
        backgroundType: 'gradient1',
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        accentColor: '#10b981',
        customCSS: '',
        autoSwitchTime: {
          enabled: false,
          lightTheme: 'gradient1',
          darkTheme: 'gradient3',
          switchTime: '18:00'
        }
      };
      console.log('Using default theme:', defaultTheme);
      return c.json(defaultTheme);
    }
    return c.json(theme);
  } catch (error) {
    console.error('Error getting theme:', error);
    return c.json({ error: `Failed to get theme: ${error.message}` }, 500);
  }
});

// Update theme settings
app.put('/make-server-af6f5999/theme', async (c) => {
  try {
    console.log('Updating theme settings...');
    const themeData = await c.req.json();
    console.log('Theme data to update:', themeData);
    
    await kv.set('linktree-theme', themeData);
    console.log('Theme updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating theme:', error);
    return c.json({ error: `Failed to update theme: ${error.message}` }, 500);
  }
});

console.log('Starting Linktree server...');
console.log('Environment check:');
console.log('- SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? '✓ Set' : '✗ Not set');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✓ Set' : '✗ Not set');
console.log('Server ready to handle requests');

Deno.serve(app.fetch);