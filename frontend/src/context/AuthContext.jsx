import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api.js';
const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [user,setUser] = useState(()=>{try{return JSON.parse(sessionStorage.getItem('sms_user')||'null')}catch{return null}});
  async function authenticate(path, payload) {
    const {data} = await api.post(`/auth/${path}`,payload);
    sessionStorage.setItem('sms_token',data.data.token); sessionStorage.setItem('sms_user',JSON.stringify(data.data.user)); setUser(data.data.user); return data.data.user;
  }
  async function login(payload){return authenticate('login',payload)}
  async function register(payload){return authenticate('register',payload)}
  function logout(){sessionStorage.removeItem('sms_token');sessionStorage.removeItem('sms_user');setUser(null)}
  const value = useMemo(()=>({user,login,register,logout}),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){return useContext(AuthContext)}
