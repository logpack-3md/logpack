import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------
// ACL (Lista de Controle de Acesso)
// ----------------------------------------------------------------------
const ROLE_PERMISSIONS = {
  // Admin: Acesso restrito apenas ao perfil (Dashboard raiz é liberada abaixo)
  admin: ['profile'], 
  
  // Manager: Acesso operacional
  manager: ['insumos', 'setores', 'pedidos', 'renegociacoes', 'profile'],
  
  // Buyer: Acesso de compras
  buyer: ['compras', 'estimar', 'profile'], 
  
  // Employee: Operacional básico
  employee: ['profile'], 
};

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

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

  if (decoded?.status === 'pendente' || decoded?.status === 'inativo') {
    return decoded.status;
  }

  if (decoded && decoded.role) {
    return decoded.role.toLowerCase();
  }

  return null;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const targetBase = '/dashboard';

  // 1. Só atua dentro do /dashboard
  if (pathname.startsWith(targetBase)) {
    
    // --- VERIFICAÇÃO DE LOGIN ---
    const userRole = getRoleFromToken(req);

    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (userRole === 'pendente' || userRole === 'inativo') {
      if (pathname !== '/dashboard') {
         return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // --- ANÁLISE DA URL ---
    const segments = pathname.split('/').filter((s) => s);
    const urlRole = segments[1]; // ex: admin, manager
    const subRoute = segments[2]; // ex: pedidos, insumos

    // --- BLOQUEIO: SPOOFING DE ROLE NA URL ---
    // Se o usuário 'manager' tentar entrar em '/dashboard/admin/...'
    if (urlRole && urlRole !== userRole) {
      // REWRITE para 404 em vez de redirecionar para a correta.
      // Isso simula que a página não existe para ele.
      return NextResponse.rewrite(new URL('/404', req.url));
    } 
    
    // Redireciona /dashboard para /dashboard/[role] (User experience)
    else if (!urlRole && pathname === targetBase) {
      return NextResponse.redirect(new URL(`${targetBase}/${userRole}`, req.url));
    }

    // --- BLOQUEIO: PERMISSÃO DE ROTA (ACL) ---
    // Se tentar acessar uma sub-rota não permitida (ex: admin acessando /pedidos)
    if (subRoute) {
      const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];
      const hasPermission = allowedRoutes.includes(subRoute);

      if (!hasPermission) {
        console.warn(`404 Simulado: ${userRole} tentou acessar ${subRoute}`);
        // REWRITE para 404: O usuário vê a tela de erro, a URL não muda.
        return NextResponse.rewrite(new URL('/404', req.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};