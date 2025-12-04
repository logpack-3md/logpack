import express from 'express';
import StorageController from '../controllers/MqttStorageController.js';

const router = express.Router();

// // Exemplo: GET /storage/SetorA
// router.get('/:setorName',
//     // AuthMiddleware.verifyToken,
//     // AuthMiddleware.isActiveUser,
//     // Adicione AuthMiddleware.isManager se for restrito apenas a gerentes
//     StorageController.getBySetor
// );

// Enviar dados de estoque atual{ setorName, current_storage }
router.put('/update',
    StorageController.updateCurrentValue
);

// Enviar dados Max Storage (media em distancia) {setorName, max_storage}
router.put('/max_storage',
    StorageController.updateMaxValue
);

router.put('/batery',
    StorageController.updateBattery
);

export default router;