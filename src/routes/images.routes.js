import upload from "../middleware/upload.js"
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

import express from 'express'
import passport from "passport"

const imageRouter = express.Router()

let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

imageRouter.route('/upload').post(
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        if(req.user.admin === false) { return res.status(401).json({ message: 'Not an admin'}) }
        next()
    },
    upload,
    (req, res) => {
        if(req.file === undefined) return res.json({ message: 'Select a file'})
        const imgUrl = `http://localhost:8080/api/image/${req.file.filename}`
        return res.status(201).json({ url: imgUrl })
    }
)

imageRouter.route('/:imageFileName').get(async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.imageFileName });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.status(404);
    }
})

imageRouter.route('/:imageFileName').delete(
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
        next()
    },
    async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.imageFileName });
        res.status(200);
    } catch (error) {
        res.status(500).json({message: error});
    }
})

export default imageRouter