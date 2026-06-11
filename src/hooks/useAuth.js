import { useState } from 'react';

export function useAuth() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  });
  return { auth, setAuth };
}
