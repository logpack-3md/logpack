// middleware.js
import { NextResponse } from 'next/server';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function getRoleFromToken(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const decoded = decodeJwt(token);
  if (decoded?.status === 'pendente' || decoded?.status === 'inativo') return 'blocked';
  return decoded?.role?.toLowerCase() || null;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const userRole = getRoleFromToken(req);

    if (!userRole || userRole === 'blocked') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const validRoles = ['admin', 'manager', 'employee', 'buyer'];
    if (!validRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Se acessou só /dashboard ou uma role errada → redireciona para a role correta
    const roleInUrl = pathname.split('/')[2]; // /dashboard/employee → "employee"

    if (pathname === '/dashboard' || (roleInUrl && roleInUrl !== userRole)) {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};