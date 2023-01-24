const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./src/Routes/route");
const commnMid = require("./src/Middleware/Auth");
const userprofile = require("./src/Models/profile");
const myDrillModel = require("./src/Models/myDrillModel");
const uploadDevice = require("./src/Models/uploadDevice");
const sncPlayerProfile = require("./src/Models/sncPlayerProfile");
const onGoingDrillModel = require("./src/Models/onGoingDrillModel");
const recommendationModel = require("./src/Models/recommendationModel");
const userModel = require("./src/Models/userModel");
const port = process.env.PORT || 3000

app.use(bodyParser.json());

mongoose.set('strictQuery', false);

//=====================[Multer Storage]=================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/images')
    },
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000000
    }
});
//============================[ User Profile]==============================

app.use('/image', express.static('./upload/images'))
app.post("/:userId/userProfile", commnMid.jwtValidation, commnMid.authorization, upload.single('image'), async (req, res) => {
    try {
        let data = req.body;
        let file = req.file;
        let userid = req.params.userId;
    
        let { dob, gender, email, contact, height, weight, image, userId } = data

        data.image = `/image/${file.filename}`;
        data.userId = userid;

        const userCreated = await userprofile.create(data)
        return res.status(201).send({
            data: userCreated
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});
//===============================[ Get Image]===============================

app.get("/:userId/getImage", commnMid.jwtValidation, commnMid.authorization, async (req, res) => {
    try {
        let body = req.query

        const getImg = await userprofile.find(body)
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: getImg
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});

//=======================[ Upload Device]=============================================
app.use('/image', express.static('./upload/images'))
app.post("/:userId/uploadDevice", commnMid.jwtValidation, commnMid.authorization, upload.fields([{ name: 'video', maxCount: 5 }, { name: 'thumbnail', maxCount: 5 }]), async (req, res) => {
    try {
        let data = req.body;
        let file = req.files;

        let { video, thumbnail, videoLength, title, category, tag } = data;

        data.video = `/image/${file.video[0].filename}`
        data.thumbnail = `/image/${file.thumbnail[0].filename}`

        const uploadDeviceCreated = await uploadDevice.create(data);
        return res.status(201).send({
            data: uploadDeviceCreated
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});
//===========================[ Get My Video]=============================
app.get("/:userId/myVideo", commnMid.jwtValidation, commnMid.authorization, async (req, res) => {
    try {
        let body = req.query;

        const getVideo = await uploadDevice.find(body);
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: getVideo
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});
//=======================[Get All Videos (Curriculum)]==============================
app.get("/curriculum", async (req, res) => {
    try {
        let body = req.query;

        const getVideo = await uploadDevice.find(body)
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: getVideo
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});
//============================[My Drills]=======================================
app.use('/image', express.static('./upload/videos'))
app.post("/:userId/myDrills", commnMid.jwtValidation, commnMid.authorization, upload.array("videos", 100), async (req, res) => {
    try {
        let data = req.body;
        let file = req.files;

        let { title, category, repetation, sets, videos } = data;

        let arr = [];
        for (let i = 0; i < file.length; i++) {
            arr.push(`/image/${file[i].filename}`)
        };
        data.videos = arr;

        const MyDrillCreated = await myDrillModel.create(data)

        let obj = {}
        obj["_id"] = MyDrillCreated._id
        obj["title"] = MyDrillCreated.title
        obj["category"] = MyDrillCreated.category
        obj["repetation"] = MyDrillCreated.repetation
        obj["sets"] = MyDrillCreated.sets
        obj["videos"] = MyDrillCreated.videos
        obj["createdAt"] = MyDrillCreated.createdAt

        return res.status(201).send({
            status: true,
            message: 'Success',
            data: obj
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});

//===================================[part-2 (snc Player)]===========================================
app.use('/image', express.static('./upload/images'))
app.post("/:userId/sncPlayerProfile", commnMid.jwtValidation, commnMid.authorization, upload.single('image'), async (req, res) => {
    try {
        let data = req.body;
        let file = req.file;

        let { image, Height, Weight, Age, Gender, Sport, Dominance, Training_age, Recent_injuries } = data
        data.image = `/image/${file.filename}`

        const sncPlayerCreated = await sncPlayerProfile.create(data)

        let obj = {}
        obj["image"] = sncPlayerCreated.image
        obj["Height"] = sncPlayerCreated.Height
        obj["Weight"] = sncPlayerCreated.Weight
        obj["Age"] = sncPlayerCreated.Age
        obj["Gender"] = sncPlayerCreated.Gender
        obj["Sport"] = sncPlayerCreated.Sport
        obj["Dominance"] = sncPlayerCreated.Dominance
        obj["Training_age"] = sncPlayerCreated.Training_age
        obj["Recent_injuries"] = sncPlayerCreated.Recent_injuries

        return res.status(201).send({
            Status: true,
            Message: "Successfully Created",
            data: obj
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});

//============================[OnGoing Drills]=======================================
app.use('/image', express.static('./upload/videos'))
app.post("/:userId/OnGoingDrills", commnMid.jwtValidation, commnMid.authorization, upload.array("videos", 100), async (req, res) => {
    try {
        let data = req.body;
        let file = req.files;

        let { title, category, repetation, sets, videos, recommendation, remarks, score } = data;

        let arr = [];
        for (let i = 0; i < file.length; i++) {
            arr.push(`/image/${file[i].filename}`)
        };
        data.videos = arr;

        const OnGoingDrillCreated = await onGoingDrillModel.create(data);

        let obj = {
            _id: OnGoingDrillCreated._id,
            title: OnGoingDrillCreated.title,
            category: OnGoingDrillCreated.category,
            repetation: OnGoingDrillCreated.repetation,
            sets: OnGoingDrillCreated.sets,
            videos: OnGoingDrillCreated.videos,
            remarks: OnGoingDrillCreated.remarks,
            score: OnGoingDrillCreated.score,
            createdAt: OnGoingDrillCreated.createdAt
        };

        return res.status(201).send({
            status: true,
            message: 'Success',
            data: obj
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});

//============================[Get OnGoing Drills]=======================================
app.get("/:userId/OnGoingDrill", commnMid.jwtValidation, commnMid.authorization, async (req, res) => {
    try {
        let data = req.query;

        let { category, title } = data
    
        let OnGoingDrillCreated = await onGoingDrillModel.findOne({ title: title });
        let Allrecommendations = await recommendationModel.find();
        // console.log(Allrecommendations)

        let obj = [{
            _id: OnGoingDrillCreated._id,
            title: OnGoingDrillCreated.title,
            category: OnGoingDrillCreated.category,
            repetation: OnGoingDrillCreated.repetation,
            sets: OnGoingDrillCreated.sets,
            videos: OnGoingDrillCreated.videos,
            remarks: OnGoingDrillCreated.remarks,
            score: OnGoingDrillCreated.score,
            recommendation: Allrecommendations
        }];
        // console.log(obj)
        return res.status(201).send({
            status: true,
            message: 'Success',
            data: obj
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});

//===========================[ post Recommendation] =====================
app.use('/image', express.static('./upload/videos'))
app.post("/:userId/recommendation", commnMid.jwtValidation, commnMid.authorization, upload.single("audioFile"), async (req, res) => {
    try {
        let data = req.body;
        let file = req.file;

        let { anecdote_no, mesage, audioFile, audiolength, createdat, manual } = data;

        data.audioFile = `/image/${file.filename}`

        const RecommendationCreated = await recommendationModel.create(data);

        let obj = [{
            anecdote_no: RecommendationCreated.anecdote_no,
            mesage: RecommendationCreated.mesage,
            audioFile: RecommendationCreated.audioFile,
            audiolength: RecommendationCreated.audiolength,
            createdat: RecommendationCreated.createdAt,
            manual: RecommendationCreated.manual
        }];

        return res.status(201).send({
            status: true,
            message: 'Success',
            data: obj
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});



mongoose.connect("mongodb+srv://Cricket:4p8Pw0p31pioSP3d@cluster0.ayvqi4c.mongodb.net/Cricket-App")
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err))

app.use("/", router)

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`)
});
