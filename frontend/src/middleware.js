
import { NextResponse } from 'next/server';

function decodeJwt(token) {
  try {

    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);

  } catch (e) {
    console.error("Erro na decodificação JWT no Middleware:", e);
    return null;
  }
}

function getRoleFromToken(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) return null;

  const decoded = decodeJwt(token);

  if (decoded && decoded.role) {
    return decoded.role.toLowerCase();
  }


  return null;
}

export function middleware(req) {
    const { pathname } = req.nextUrl;
    const targetPath = '/dashboard';

    if (pathname === targetPath) {
        const userRole = getRoleFromToken(req);

        if (!userRole) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const newPath = `${targetPath}/${userRole}`; 

        return NextResponse.redirect(new URL(newPath, req.url));
    }

    if (pathname.startsWith(targetPath)) {

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};