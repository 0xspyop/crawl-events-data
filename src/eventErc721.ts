import dotenv from "dotenv";
import { getLastBlockData, NFTContract, provider } from "./network";
dotenv.config();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEventsErc721() {
    const lastesBlock = await provider.getBlockNumber();
    const RANGE_BLOCKS = parseInt(process.env.RANGE_BLOCKS);
    const SLEEP = parseInt(process.env.DELAY);
    const END_BLOCK = process.env.END_BLOCK === "lastes" ? lastesBlock : parseInt(process.env.END_BLOCK);
    const START_BLOCK = parseInt(process.env.START_BLOCK);
    let start = START_BLOCK;
    let end = END_BLOCK - START_BLOCK < RANGE_BLOCKS ? END_BLOCK - 1 : START_BLOCK + RANGE_BLOCKS;
    let events = [];

    while (end < END_BLOCK) {
        try {
            await sleep(SLEEP);
            const filter = NFTContract.filters.Transfer();
            const result = await NFTContract.queryFilter(filter, start, end);
            console.log(`${start} - ${end}`);
            console.log(result);

            // saveDatas(result, method);
            events.push(result);
            start = end + 1;
            end = start + RANGE_BLOCKS - 1;
            if (end > END_BLOCK) {
                end = END_BLOCK;
            }
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}
