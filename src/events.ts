import dotenv from "dotenv";
import { getLastBlockData, marketContract, provider } from "./network";
import { saveDatas } from "./saveData";
dotenv.config();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEvents() {
    const lastDataBlock = await getLastBlockData();
    const lastesBlock = await provider.getBlockNumber();
    const RANGE_BLOCKS = parseInt(process.env.RANGE_BLOCKS);
    const SLEEP = parseInt(process.env.DELAY);
    const END_BLOCK = process.env.END_BLOCK === "lastes" ? lastesBlock : parseInt(process.env.END_BLOCK);
    const START_BLOCK = parseInt(process.env.START_BLOCK);
    let start = START_BLOCK;
    // const START_BLOCK = lastDataBlock ?? parseInt(process.env.START_BLOCK);
    // let start = lastDataBlock ?? START_BLOCK;
    let end = END_BLOCK - START_BLOCK < RANGE_BLOCKS ? END_BLOCK - 1 : START_BLOCK + RANGE_BLOCKS;

    while (end < END_BLOCK) {
        try {
            await sleep(SLEEP);
            const filterPlaceOrder = marketContract.filters.PlaceOrder();
            const resultPlaceOrder = await marketContract.queryFilter(filterPlaceOrder, start, end);
            await saveDatas(resultPlaceOrder, "PlaceOrder");

            const filterCancelOrder = marketContract.filters.CancelOrder();
            const resultCancelOrder = await marketContract.queryFilter(filterCancelOrder, start, end);
            await saveDatas(resultCancelOrder, "CancelOrder");

            const filterFillOrder = marketContract.filters.FillOrder();
            const resultFillOrder = await marketContract.queryFilter(filterFillOrder, start, end);
            await saveDatas(resultFillOrder, "FillOrder");

            console.log(`${start} - ${end}`);

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
