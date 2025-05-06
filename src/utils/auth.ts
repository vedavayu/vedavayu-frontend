export function isAdminAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const user = JSON.parse(localStorage.getItem('user') ?? 'null');
    return user?.role === 'admin';
  } catch {
    return false;
  }
}
  
  export function adminLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }