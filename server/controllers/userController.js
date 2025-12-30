
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import  cloudinary  from "../lib/cloudinary.js"; // ✅ correct spelling

// signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        // Exclude password from response
        const userData = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            bio: newUser.bio,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json({
            success: true,
            userData,
            token,
            message: "Account created successfully"
        });

    } catch (error) {
        console.error("Signup error:", error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        
        // Generic error
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({ success: false, message: "Account does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);
        
        // Exclude password from response
        const userResponse = {
            _id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            profilePic: userData.profilePic,
            bio: userData.bio,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        };
        
        res.status(200).json({ success: true, userData: userResponse, token, message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// check authentication
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// update profile controller
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            // Update without profile picture
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            ).select("-password");
        } else {
            // Check if Cloudinary is configured
            const isCloudinaryConfigured = process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET;
            
            if (isCloudinaryConfigured) {
                // Upload profile picture to Cloudinary
                console.log("Uploading profile picture to Cloudinary...");
                
                try {
                    const upload = await cloudinary.uploader.upload(profilePic, {
                        folder: "chat-app-profiles",
                        resource_type: "image",
                        transformation: [
                            { width: 400, height: 400, crop: "fill", gravity: "face" }
                        ]
                    });

                    console.log("Profile picture uploaded successfully:", upload.secure_url);

                    updatedUser = await User.findByIdAndUpdate(
                        userId,
                        {
                            profilePic: upload.secure_url,
                            bio,
                            fullName
                        },
                        { new: true }
                    ).select("-password");
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    return res.status(500).json({ 
                        success: false, 
                        message: uploadError.message || "Failed to upload image. Please try again." 
                    });
                }
            } else {
                // Fallback: Store base64 image directly in database (for development)
                console.log("Cloudinary not configured. Storing image as base64 in database.");
                console.warn("⚠️  For production, please configure Cloudinary in .env file");
                
                // Validate base64 image size (max 2MB)
                const base64Size = (profilePic.length * 3) / 4;
                const maxSize = 2 * 1024 * 1024; // 2MB
                
                if (base64Size > maxSize) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Image too large. Maximum size is 2MB. Please configure Cloudinary for larger images." 
                    });
                }

                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        profilePic: profilePic, // Store base64 directly
                        bio,
                        fullName
                    },
                    { new: true }
                ).select("-password");
            }
        }

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update profile" });
    }
};
