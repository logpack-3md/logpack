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

// Enviar dados de estoque atual{ id_dispositivo, valor }
router.put('/update',
    StorageController.updateCurrentValue
);

// Enviar dados Max Storage (media em distancia) {id_dispositivo, valo}
router.put('/max_storage',
    StorageController.updateMaxValue
);
// Enviar dados batery (medida em volts) {id_dispositivo, valor}
router.put('/batery',
    StorageController.updateBattery
);

export default router;