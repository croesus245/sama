const SafeJSON = {
    parse(data, fallback = null) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('JSON parse error:', e);
            console.log('Attempted to parse:', data);
            return fallback;
        }
    },
    
    stringify(data, fallback = '{}') {
        try {
            return JSON.stringify(data);
        } catch (e) {
            console.error('JSON stringify error:', e);
            return fallback;
        }
    }
};

// Replace all JSON usage
const accounts = SafeJSON.parse(localStorage.getItem('realtorAccounts'), []);
localStorage.setItem('realtorAccounts', SafeJSON.stringify(accounts, '[]'));

{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/realtor-login",
      "dest": "/realtor-login.html"
    },
    {
      "src": "/realtor-dashboard",
      "dest": "/realtor-dashboard.html"
    },
    {
      "src": "/roommate-finder",
      "dest": "/roommate-finder.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}