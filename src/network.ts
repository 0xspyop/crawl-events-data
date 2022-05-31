import dotenv from "dotenv";
import fs from "fs";
import { ethers } from "ethers";
import { Erc721__factory, Market__factory } from "./typechain";
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const ADDRESS = process.env.ADDRESS;
const NFT = process.env.NFT;

export const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
export const marketFactory = Market__factory.createInterface();
export const marketContract = Market__factory.connect(ADDRESS, provider);
export const NFTContract = Erc721__factory.connect(NFT, provider);

export const getLastBlockData = async () => {
    try {
        const { lastBlock } = JSON.parse(fs.readFileSync(`database/lastes-data.json`).toString());
        return lastBlock + 1;
    } catch (error) {
        return 0;
    }
};
