const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
const token = 'eyJzdWIiOjEsImVtYWlsIjoicHJvZmlsZXRlc3QxQGV4YW1wbGUuY29tIiwicm9sZSI6ImNsaWVudGUiLCJleHAiOjE3NzgwNjgzMjd9.67c8f900818db220c7986b1c7f68cc400b35835ccfb5bda19ab703021a1b5f13';

async function run() {
  const res = await fetch('http://localhost:3001/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: 'Teste', icon: dataUrl }),
  });
  console.log('status', res.status);
  console.log(await res.text());
}

run().catch(console.error);
