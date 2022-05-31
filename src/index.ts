import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./configs/db";
import { getEvents } from "./events";
dotenv.config();

async function main() {
    await connectDB();
    await getEvents();
}

main()
    .then(() => {
        console.log("Done");
        disconnectDB();
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        disconnectDB();
        process.exit(1);
    });
