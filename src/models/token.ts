import mongoose from "mongoose";

export interface IToken {
    tokenId: number;
    seller: string;
    price: number;
    type: string;
    blockNumber: number;
    txIndex: number;
    lastTxHash: string;
}

const Token = new mongoose.Schema<IToken & { txHistory: IToken[] }>(
    {
        tokenId: {
            type: Number,
            required: true,
            unique: true,
        },
        seller: String,
        price: Number,
        type: String,
        blockNumber: Number,
        txIndex: Number,
        txHistory: [
            {
                tokenId: Number,
                seller: String,
                price: Number,
                type: String,
                blockNumber: Number,
                txIndex: Number,
            },
        ],
        lastTxHash: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Token", Token);
