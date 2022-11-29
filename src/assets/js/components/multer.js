//Import Multer
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + "--" + file.originalname);
    }
});

//Supported file types 'jpg or jpeg' , 'png' , 'pdf'
const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg') || (file.mimetype).includes('pdf')){
        cb(null, true);
    } else{
        cb(null, false);

    }

};

let upload = multer({ storage: storage, fileFilter: fileFilter,});

export default upload.single('ProfilePicture')