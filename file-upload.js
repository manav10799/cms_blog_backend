const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, './uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({
    storage: storage,
});

router.post('/', upload.array('files'), (req, res) => {
    res.json({ message: 'Files uploaded successfully' });
});

router.get('/files',(req, res) => {
    const uploadFolder = path.join(__dirname, 'uploads');
    fs.readdir(uploadFolder,(err,files)=> {
        if(err) {
            console.error(err);
            res.status(500).json({ error:'Can not find uploaded'});
            return;
        }
        const fileContents = files.map((filename) => {
            const filePath = path.join(uploadFolder, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            return { filename, content };
        });
        res.json({fileContents});
    });
});

module.exports = router;
