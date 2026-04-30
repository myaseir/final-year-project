const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Login - Updated to use 'identifier' for dual Email/CNIC login
  login: (identifier, pin) => 
    fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, pin }) // Matches the new Backend LoginRequest schema
    }).then(res => res.json()),

  // Register
  register: (data) => 
    fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Get Profile & History
  // Updated to use 'identifier' so it works with either Email or CNIC
  getProfile: (identifier) => 
    fetch(`${BASE_URL}/api/user/profile/${identifier}`).then(res => res.json()),

  // Request Top-up
  requestTopup: (data) => 
  fetch(`${BASE_URL}/api/user/wallet/request-topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cnic: data.cnic,
      amount: parseInt(data.amount), // Ensure amount is a number
      reference_id: data.reference_id
    })
  }).then(res => res.json()),
};