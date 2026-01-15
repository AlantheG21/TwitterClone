import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        });

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json({ message: "All notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    try {
        const notification = await Notification.findOne({ _id: notificationId, to: userId });
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        await Notification.deleteOne({ _id: notificationId });

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}