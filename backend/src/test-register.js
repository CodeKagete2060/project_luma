(async () => {
  try {
    const email = `test+${Date.now()}@example.com`;
    const payload = {
      name: 'Automated Test',
      email,
      password: 'TestPass123!',
      role: 'student'
    };

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
})();
