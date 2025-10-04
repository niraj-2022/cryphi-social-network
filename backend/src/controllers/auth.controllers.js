import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req,res){
    const {email, password, fullName} = req.body;

    try{
        if (!email || !password || !fullName){
            return res.status(400).json({message: "All fileds are required"});
        }
        if (password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid Email Format"});
        }
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: "Email already exists"});
        }
        const idx = Math.floor(Math.random()*100) + 1; // generate random num between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        try{
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        }catch(error){
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWt_SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(201).json({success:true, user:newUser});
    }catch(error){
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function login(req,res){
    try{
        const {email,password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if (!user){
            return res.status(401).json({message: "Invalid Email or Password"});
        }     
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect){
            return res.status(401).json({message: "Invalid Email or Password"});
        }

        if (user.currentSessionToken){
            return res.status(403).send("Already logged in on another device");
        }

        const token = jwt.sign({userId: user._id}, process.env.JWt_SECRET_KEY, {
            expiresIn: "7d"
        });

        user.currentSessionToken = token;
        await user.save();

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({success: true, user});
    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export function logout(req,res){
    res.clearCookie("jwt");
    User.findByIdAndUpdate(req.userId, { currentSessionToken: null })
    .exec()
    .catch((err) => console.error("Error clearing session token:", err));
    res.status(200).json({success: true, message: "Successfully logged out!"});
}

export async function onboard(req, res) {
    try{
        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || ! location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new: true})

        if (!updatedUser){
            return res.status(404).json({message: "User not found"});
        }

        try{
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
        })
        console.log(`Stream user updatewd after onboarding for ${updatedUser.fullName}`);
        }catch(streamerror){
            console.log("Error updating stream during onboarding:", streamerror.message);
        }

        res.status(200).json({message: true, user: updatedUser});
    }catch(error){
        console.log("Onboarding error:", error);
        req.status(500).json({message: "Internal Server Error"});
    }
}