async function run() {
  try {
    const registerRes = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'profiletest1@example.com', password: '123456' }),
    });
    console.log('register', registerRes.status);
    console.log(await registerRes.text());

    const loginRes = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'profiletest1@example.com', password: '123456' }),
    });
    console.log('login', loginRes.status);
    console.log(await loginRes.text());
  } catch (err) {
    console.error(err);
  }
}

run();