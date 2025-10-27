import { ListUser } from "@/components/ListUsers/page";
import { apiServer } from "@/lib/api-server"; // Certifique-se de que este caminho está correto

export default async function UserListPage () {
    let initialUsersData = { data: [], totalItems: 0, currentPage: 0, pageSize: 10 };

    // Define os parâmetros iniciais para a requisição do servidor (1-based para a API)
    const initialPage = 1; 
    const initialLimit = 10;

    try {
        // ATUALIZADO: Ajustado para usar '$page' e 'limit',
        // correspondendo à chamada da API definida no hook useUsers.
        const response = await apiServer.get("admin", { 
            params: { 
              $page: initialPage, // <-- Alterado de 'page' para '$page'
              limit: initialLimit 
            } 
        });
        
        initialUsersData = {
            data: response?.data || [],
            totalItems: response?.totalItems || response?.meta?.totalItems || 0,
            currentPage: (response?.currentPage && response.currentPage > 0) ? response.currentPage - 1 : 0, // Converte para 0-based
            pageSize: response?.pageSize || initialLimit,
        };
        // console.log("Initial users fetched on server:", initialUsersData.data.length, "total:", initialUsersData.totalItems);
    } catch (error) {
        console.error("Error fetching initial users on server:", error);
    }

    // As props passadas para ListUser estão corretas.
    // O componente <ListUser> (que é "use client")
    // deverá pegar essas props e passá-las para o hook useUsers.
    return (
        <>
            <ListUser 
                initialUsers={initialUsersData.data}
                initialTotalItems={initialUsersData.totalItems}
                initialPageIndex={initialUsersData.currentPage} // Passa 0-based
                initialPageSize={initialUsersData.pageSize}
            />
        </>
    );    
}