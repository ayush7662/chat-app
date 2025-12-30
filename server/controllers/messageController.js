import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Sidebar users with unseen messages
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.error("Sidebar Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get chat messages between two users
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });

        // Mark messages as seen
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId },
            { seen: true }
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.error("GetMessages Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark a specific message as seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error("MarkSeen Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send message (text or image)
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        // Validate that we have either text or image
        if (!text && !image) {
            return res.status(400).json({ 
                success: false, 
                message: "Message must contain either text or image" 
            });
        }

        let imageUrl;
        if (image) {
            // Validate image size (max 10MB)
            const base64Size = (image.length * 3) / 4;
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (base64Size > maxSize) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Image size too large. Maximum size is 10MB." 
                });
            }

            // Check if Cloudinary is properly configured
            const isCloudinaryConfigured = process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET;
            
            if (isCloudinaryConfigured) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image, {
                        resource_type: "image",
                        folder: "chat-app",
                        transformation: [
                            { width: 1000, height: 1000, crop: "limit", quality: "auto" }
                        ]
                    });
                    imageUrl = uploadResponse.secure_url;
                    console.log("Image uploaded to Cloudinary successfully");
                } catch (uploadError) {
                    console.error("Cloudinary Upload Error:", uploadError.message);
                    return res.status(500).json({ 
                        success: false, 
                        message: uploadError.message || "Failed to upload image. Please try again." 
                    });
                }
            } else {
                // Fallback: Store base64 image directly in database (for development)
                console.log("Cloudinary not configured. Storing image as base64 in database.");
                console.warn("⚠️  For production, please configure Cloudinary in .env file");
                
                // Limit base64 size to 2MB when not using Cloudinary
                const maxBase64Size = 2 * 1024 * 1024; // 2MB
                if (base64Size > maxBase64Size) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Image too large. Maximum size is 2MB without Cloudinary. Please configure Cloudinary for larger images." 
                    });
                }
                
                imageUrl = image; // Store base64 directly
            }
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Emit socket message if receiver is online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.error("SendMessage Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
