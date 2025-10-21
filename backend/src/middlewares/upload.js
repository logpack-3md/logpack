import multer from 'multer';
 
const storage = multer.memoryStorage();


const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo não suportado. Por favor, envie uma imagem."), false);
        }
    }
});

export const uploadSingleImage = upload.single('image'); 