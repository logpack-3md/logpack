import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import BuyerController from "../controllers/BuyerController.js";
import ManagerController from "../controllers/ManagerController.js";

const router = express.Router()

// paginação de compras
router.get('/compras',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager,
    AuthMiddleware.isBuyer,
    BuyerController.getCompras
)

router.get('/orcamentos', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    ManagerController.getOrcamentos
)

// // buscar um orçamento
// router.get('/orcamentos/:orcamentoId', 
//     AuthMiddleware.verifyToken,
//     AuthMiddleware.isActiveUser,
//         AuthMiddleware.isBuyer,
//     ManagerController.getOrcamento
// )

// buscar uma compra
router.get('/compras/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.getCompra
)

// criar orçamento a partir de id de compra
router.post('/orcamento/:compraId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.createOrcamento
)

// atualizar descrição de orçamento
router.put('/orcamento/descricao/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.updateOrcamento
)

// renegociação de orçamento / alterar valor de orçamento
router.put('/orcamento/renegociar/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    AuthMiddleware.isOrcamentoCanceled,
    AuthMiddleware.renegociacaoRequested,
    BuyerController.renegociarOrcamento
)

// cancelar orçamento (altera status de compra e orçamento para "cancelado", e pedido volta para "solicitado")
router.put('/orcamento/cancelar/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.cancelarOrcamento
)

export default router