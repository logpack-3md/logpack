import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------
// ACL (Lista de Controle de Acesso por Cargo)
// Define quais sub-rotas cada cargo ATIVO pode acessar.
// ----------------------------------------------------------------------
const ROLE_PERMISSIONS = {
  admin: ['profile', 'logAdmin'],
  manager: ['insumos', 'setores', 'pedidos', 'renegociacoes', 'profile', 'compras', 'logManager'],
  buyer: ['compras', 'orcamentos', 'pedidos', 'estimar', 'profile', 'logBuyer'],
  employee: ['insumos', 'pedidos', 'profile', 'logEmployee'],
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

// Helper aprimorado para retornar objeto completo
function getUserFromToken(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  const decoded = decodeJwt(token);
  if (!decoded) return null;

  return {
    role: decoded.role?.toLowerCase(),
    status: decoded.status // ativo, inativo, pendente
  };
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const targetBase = '/dashboard';

  // 1. Atua apenas dentro de /dashboard
  if (pathname.startsWith(targetBase)) {
    
    // --- A. VERIFICAÇÃO DE TOKEN ---
    const user = getUserFromToken(req);

    // Se não houver token/usuário, login
    if (!user || !user.role) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Extrai partes da URL: /dashboard / [role] / [subRoute]
    const segments = pathname.split('/').filter((s) => s);
    const urlRole = segments[1]; 
    const subRoute = segments[2];

    // --- B. TRATAMENTO DE USUÁRIO INATIVO / PENDENTE ---
    // Se não estiver ativo, ele é bloqueado de navegar em sub-rotas profundas.
    if (user.status !== 'ativo') {
      const safeUrl = `${targetBase}/${user.role}`;

      // Se ele tentar acessar qualquer coisa que não seja a "home" do dashboard dele...
      // Ex: /dashboard/manager/insumos -> REDIRECIONA para /dashboard/manager
      // Lá, o componente da página (que você já tem) vai mostrar o Card de Bloqueio.
      if (pathname !== safeUrl) {
         return NextResponse.redirect(new URL(safeUrl, req.url));
      }
      
      // Se ele já está na safeUrl, deixa renderizar (vai aparecer o Card de Bloqueio)
      return NextResponse.next();
    }

    // --- C. SEGURANÇA DE URL (ANTI-SPOOFING DE CARGO) ---
    // (Apenas para usuários ativos daqui para baixo)
    if (urlRole && urlRole !== user.role) {
      // Se um 'manager' tentar entrar em '/dashboard/admin/...'
      // Rewrite para 404 para parecer que a página não existe
      return NextResponse.rewrite(new URL('/404', req.url));
    } 
    
    // Se acessar a raiz /dashboard sem cargo, redireciona para /dashboard/[role]
    else if (!urlRole && pathname === targetBase) {
      return NextResponse.redirect(new URL(`${targetBase}/${user.role}`, req.url));
    }

    // --- D. ACL (PERMISSÃO DE ROTA) ---
    // Verifica se o cargo ATIVO tem permissão para a sub-rota (ex: /insumos)
    if (subRoute) {
      const allowedRoutes = ROLE_PERMISSIONS[user.role] || [];
      
      // Permite se estiver na lista ou se for acesso irrestrito '*'
      const hasPermission = allowedRoutes.includes(subRoute) || allowedRoutes.includes('*');

      if (!hasPermission) {
        console.warn(`ACL Block: ${user.role} tentou acessar ${subRoute}`);
        // Mostra 404 para proteger a existência da rota
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