const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Fichier d'import temporaire (supprimé après lecture par PneuController) :
// dossier temporaire du système. En production, le code (/opt/landolsi) est en
// lecture seule pour le service (systemd ProtectSystem=strict) ; /tmp est privé
// au service (PrivateTmp=yes) et accessible en écriture.
const dossier = path.join(os.tmpdir(), "landolsi-excel");
fs.mkdirSync(dossier, { recursive: true, mode: 0o700 });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dossier);
    },

    filename: (req, file, cb) => {
        cb(null, `import-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".xlsx") {
        return cb(new Error("Veuillez sélectionner un fichier Excel .xlsx."));
    }

    cb(null, true);
};

const uploadExcel = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadExcel;