import upload from "../middleware/upload.js"
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'
import multer from 'multer'

let gfs;

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

// {
// 	"email": "aguru201@hotmail.com",
// 	"password": "HolaHolaHola"
// }

export default function imagesRoutes(app, passport) {
    app.route('/api/image/upload')
        .post(
            //passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            // (req, res, next) => {
            //     if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
            //     next()
            // }, //POR ALGUNA RAZON req.user = undefined
            upload,
            (req, res) => {
                if(req.file === undefined) return res.json({ message: 'Select a file'})
                const imgUrl = `http://localhost:8080/api/image/${req.file.filename}`
                return res.status(201).json({ url: imgUrl })
            }
        )
    app.route('/api/image/:imageFileName')
        .get(async (req, res) => {
            try {
                const file = await gfs.files.findOne({ filename: req.params.imageFileName });
                const readStream = gfs.createReadStream(file.filename);
                readStream.pipe(res);
            } catch (error) {
                res.status(404);
            }
        })

        .delete(
            // passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            // (req, res, next) => {
            //     if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
            //     next()
            // }, //POR ALGUNA RAZON req.user = undefined
            async (req, res) => {
            try {
                await gfs.files.deleteOne({ filename: req.params.imageFileName });
                res.status(200);
            } catch (error) {
                res.status(500).json({message: error});
            }
        })
}