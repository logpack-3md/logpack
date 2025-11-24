
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

  if (decoded.status === 'pendente' || decoded.status === 'inativo') {
    return decoded.status
  }

  if (decoded && decoded.role) {
    return decoded.role.toLowerCase();
  }

  return null;
}

export function middleware(req) {
    const { pathname } = req.nextUrl;
    const targetBase = '/dashboard';

    // 1. Só atua se a rota começar com /dashboard
    if (pathname.startsWith(targetBase)) {
        const userRole = getRoleFromToken(req);
        
        if (!userRole) {
            // Não autenticado: Redireciona para login
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // 2. Extrai a role na URL se houver (ex: 'admin' em /dashboard/admin/insumos)
        // [role] será o 2º segmento (índice 2) se for /dashboard/[role]/...
        const segments = pathname.split('/').filter(s => s);
        const urlRole = segments[1]; 
        
        // 3. Ação de Proteção/Redirecionamento
        if (urlRole && urlRole !== userRole) {
            // Usuário 'admin' acessando /dashboard/manager/insumos
            
            // Substitui a role incorreta na URL pela role correta
            segments[1] = userRole; 
            const newPath = '/' + segments.join('/');

            // console.log(`MIDDLEWARE: Usuário ${userRole} redirecionado de ${pathname} para ${newPath}`);
            return NextResponse.redirect(new URL(newPath, req.url));
            
        } else if (!urlRole && pathname === targetBase) {
            // Usuário acessando a rota base /dashboard
            const newPath = `${targetBase}/${userRole}`;
            return NextResponse.redirect(new URL(newPath, req.url));
        }

        // Continua se a rota estiver correta (ex: /dashboard/admin/insumos, sendo admin)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};