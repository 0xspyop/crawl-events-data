import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        return mongoose
            .connect(process.env.MONGO_URL)
            .then(() => {
                console.log("Connected to MongoDB");
            })
            .catch((err) => {
                console.error(err);
                process.exit(1);
            });
    } catch (error) {
        console.log(error);
    }
};

export const disconnectDB = async () => {
    return mongoose.disconnect().then(() => {
        console.log("Disconnected from MongoDB");
    });
};
