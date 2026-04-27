const http = require('http');

http.get('http://localhost:5173/api/properties', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`Total properties returned: ${parsed.data.properties.length}`);
      const lastFew = parsed.data.properties.slice(-3);
      lastFew.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
    } catch(e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
}).on('error', (err) => console.error('Request Error:', err.message));
