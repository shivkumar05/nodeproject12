const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tagModel = require("../Models/tagModel");
const userModel = require("../Models/userModel");
const profileModel = require("../Models/profile");
const wicketModel = require("../Models/wicketModel");
const battingModel = require("../Models/battingModel");
const bowlingModel = require("../Models/bowlingModel");
const bow_batModel = require("../Models/bow_batModel");
const routineModel = require("../Models/routineModel");
const myDrillModel = require("../Models/myDrillModel");
const categoryModel = require("../Models/categoryModel");
const powerTestModel = require("../Models/power_testModel");
const readinessSurveyModel = require("../Models/readinessSurvey");
const strengthTestModel = require("../Models/strength_testModel");
const { default: mongoose } = require("mongoose");

//==========================[user register]==============================
const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { name, phone, join_as, signup_as, email, password } = data

        if (await userModel.findOne({ phone: phone }))
            return res.status(400).send({ message: "Phone already exist" })

        if (await userModel.findOne({ email: email }))
            return res.status(400).send({ message: "Email already exist" })

        const encryptedPassword = bcrypt.hashSync(password, 12)
        req.body['password'] = encryptedPassword;

        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
};
//==========================[user login]==============================

const userLogin = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data;

        let user = await userModel.findOne({ email: email })
        // console.log(user._id)
        if (!user) {
            return res.status(400).send({
                status: false,
                msg: "Email and Password is Invalid"
            })
        };

        let compared = await bcrypt.compare(password, user.password)
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your password is invalid"
            })
        };

        let UserProfile = await profileModel.findOne({ email: email }).select({_id:0, createdAt:0, updatedAt:0, __v:0});
        let type = UserProfile ? "Yes" : "No";
        user.user_details_submit = type;

        let token = jwt.sign({
            userId: user._id,
        }, "project")
        
        let Questions = await bow_batModel.findOne().select({_id:0, createdAt:0, updatedAt:0, __v:0});
        user.userQuestion = Questions;

        return res.status(200).send({
            status: true,
            msg: "User login successfull",
            data: {
                userId: user._id,
                name: user.name,
                phone: user.phone,
                join_as: user.join_as,
                signup_as: user.signup_as,
                email: user.email,
                password: user.password,
                user_details_submit: user.user_details_submit,
                userQuestion: user.userQuestion,
                token: token,
                userProfile: UserProfile
            }
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        })
    }
};
//===========================[create bat_bow]===============================

const bow_bat = async function (req, res) {
    try {
        let data = req.body;
        data = JSON.parse(JSON.stringify(data));

        const actionCreated = await bow_batModel.create(data)

        return res.status(201).send({
            status: true,
            message: "Success",
            data: actionCreated
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[progress screen (batting)]==============================

const createBattings = async function (req, res) {
    try {
        let data = req.body
        //***********check if the body is empty**************//
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should  be not Empty please enter some data to create batting"
            })
        }
        const battingCreated = await battingModel.create(data)

        return res.status(201).send({
            status: true,
            message: "Battings created successfully",
            data: battingCreated
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[progress screen (bowling)]==============================

const createBowlings = async function (req, res) {
    try {
        let data = req.body
        //***********check if the body is empty**************//
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should  be not Empty please enter some data to create Bowlings"
            })
        }
        const bowlingCreated = await bowlingModel.create(data)

        return res.status(201).send({
            status: true,
            message: "Bowling created successfully",
            data: bowlingCreated
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[progress screen (wicket)]==============================

const createWickets = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should  be not Empty please enter some data to create Wickets"
            })
        }
        const wicketCreated = await wicketModel.create(data)
        return res.status(201).send({
            status: true,
            message: "Wicket created successfully",
            data: wicketCreated
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[create category]==============================
const category = async function (req, res) {
    try {
        let data = req.body;

        let category = await categoryModel.create(data);
        let obj = {}
        obj["category_id"] = category.category_id
        obj["category_name"] = category.category_name

        return res.status(201).send({
            message: "category created successfully",
            data: obj
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[Get Category]==============================
const getCategory = async function (req, res) {
    try {
        let body = req.body;

        const Category = await categoryModel.find(body).select({ category_id: 1, category_name: 1, _id: 0 });

        return res.status(200).send({
            status: true,
            message: "success",
            data: Category
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[create tag]==============================

const tag = async function (req, res) {
    try {
        let data = req.body;

        let tags = await tagModel.create(data);
        let obj = {}
        obj["tag_id"] = tags.tag_id
        obj["tag"] = tags.tag
        obj["category_id"] = tags.category_id
        obj["category_name"] = tags.category_name

        return res.status(201).send({
            message: "tags created successfully",
            data: obj
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//========================================================================

const getTags = async function (req, res) {
    try {
        let body = req.body;

        const Tag = await tagModel.find(body).select({ tag_id: 1, tag: 1, category_id: 1, category_name: 1, _id: 0 });

        return res.status(200).send({
            status: true,
            data: Tag
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//===================================================

const createRoutine = async function (req, res) {
    try {
        let data = req.body;
        let { drills, date, time } = data;

        if (await routineModel.findOne({ date: date, time: time }))
            return res.status(400).send({ status: false, message: "You already have a routine set for this time" })

        const routinesCreated = await routineModel.create(data);
        
        return res.status(201).send({
            message: "Success",
            data: routinesCreated
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};

//=======================================================

const getRoutine = async function (req, res) {
    try {
        let data = req.query;

        const getDrills = await routineModel.find(data).sort({ time: data.time })

        return res.status(200).send({
            status: true,
            data: getDrills
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//======================================================================
const getMyDrills = async function (req, res) {
    try {
        let body = req.body;

        const drills = await myDrillModel.find(body).select({ _id: 1, title: 1, category: 1, repetation: 1, sets: 1, createdAt: 1 });

        return res.status(200).send({
            status: true,
            message: "success",
            data: drills
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==========================[part-2 (readinessSurveyModel)]===============================

const readinessSurvey = async function (req, res) {
    try {
        let data = req.body

        const createReadinessSurvey = await readinessSurveyModel.create(data)

        let obj = {}
        obj["Sleep"] = createReadinessSurvey.Sleep
        obj["Mood"] = createReadinessSurvey.Mood
        obj["Energy"] = createReadinessSurvey.Energy
        obj["Stressed"] = createReadinessSurvey.Stressed
        obj["Sore"] = createReadinessSurvey.Sore
        obj["Heart_rate"] = createReadinessSurvey.Heart_rate
        obj["Urine_color"] = createReadinessSurvey.Urine_color

        return res.status(201).send({
            status: true,
            message: "Created successfully",
            data: obj
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};
//==============================[part-2 (Test Details)]========================
const createPowerTest = async function (req, res) {
    try {
        let data = req.body;

        const powerTest = await powerTestModel.create(data);

        let obj = {};

        obj["vertical_jump"] = powerTest.vertical_jump
        obj["squat_jump"] = powerTest.squat_jump
        obj["standing_broad_jump"] = powerTest.standing_broad_jump
        obj["ball_chest_throw"] = powerTest.ball_chest_throw
        obj["hang_cleans"] = powerTest.hang_cleans
        obj["cleans"] = powerTest.cleans
        obj["power_cleans"] = powerTest.power_cleans
        obj["snatch_floor"] = powerTest.snatch_floor
        obj["hang_snatch"] = powerTest.hang_snatch
        obj["split_jerk"] = powerTest.split_jerk

        return res.status(201).send({
            status: true,
            message: "Created successfully",
            data: obj
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
};

//====================================[part-2 (Stength Test)]======================

const createStrengthTest = async function (req, res) {
    try {
        let data = req.body;

        const strengthTest = await strengthTestModel.create(data);

        let obj = {};

        obj["back_squats"] = strengthTest.back_squats
        obj["front_squats"] = strengthTest.front_squats
        obj["conventional_deadlifts"] = strengthTest.conventional_deadlifts
        obj["barbell_bench_press"] = strengthTest.barbell_bench_press
        obj["barbell_bench_pulls"] = strengthTest.barbell_bench_pulls

        return res.status(201).send({
            status: true,
            message: "Created successfully",
            data: obj
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports = { createUser, userLogin, createBattings, createBowlings, createWickets, bow_bat, createRoutine, getRoutine, category, getCategory, getTags, tag, getMyDrills, readinessSurvey, createPowerTest, createStrengthTest }