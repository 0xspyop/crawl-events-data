import { EventResult, Methods } from "./type";
import TokenSchema from "./models/token";
export const saveDatas = async (events: EventResult, method: Methods) => {
    events.map(async (ev) => {
        const data = {
            tokenId: +ev.args.tokenId,
            blockNumber: ev.blockNumber,
            seller: ev.args.seller,
            price: +ev.args.price || 0,
            type: method,
            txIndex: ev.transactionIndex,
            lastTxHash: ev.transactionHash,
        };
        // const fileName = `database/tokenIds/${+ev.args.tokenId}.json`;
        await TokenSchema.findOne({ tokenId: data.tokenId })
            .then(async (token) => {
                try {
                    if (data.blockNumber === token.blockNumber) {
                        if (token.txIndex === data.txIndex) {
                            console.log(`${method} - duplicate`);
                        } else if (data.txIndex > token.txIndex) {
                            console.log(`tokenId: ${+ev.args.tokenId} - ${method} - update`);

                            await TokenSchema.updateOne(
                                { tokenId: data.tokenId },
                                {
                                    ...data,
                                    txHistory: [...token.txHistory, data],
                                },
                                { upsert: true }
                            );
                        } else {
                            console.log(`tokenId: ${+ev.args.tokenId} - ${method} - update old txIndex`);

                            await TokenSchema.updateOne(
                                { tokenId: data.tokenId },
                                {
                                    txHistory: [...token.txHistory, data],
                                },
                                { upsert: true }
                            );
                        }
                    } else if (data.blockNumber > token.blockNumber) {
                        console.log(`tokenId: ${+ev.args.tokenId} - ${method} - update`);

                        await TokenSchema.updateOne(
                            { tokenId: data.tokenId },
                            {
                                ...data,
                                txHistory: [...token.txHistory, data],
                            },
                            { upsert: true }
                        );
                    } else {
                        const txHistory = token.txHistory.find((tx) => tx.lastTxHash === data.lastTxHash);
                        if (!txHistory) {
                            console.log(`tokenId: ${+ev.args.tokenId} - ${method} - update to txHistory`);

                            await TokenSchema.updateOne(
                                { tokenId: data.tokenId },
                                {
                                    txHistory: [...token.txHistory, data],
                                },
                                { upsert: true }
                            );
                        }
                    }
                } catch (error) {
                    console.log(error);
                    console.log(token);
                }
            })
            .catch(async (err) => {
                console.log(`TokenId: ${+ev.args.tokenId} - ${method} - create`);
                await TokenSchema.create({
                    ...data,
                    txHistory: [data],
                }).catch((error) => {
                    console.log("---->", error);
                });
            })
            .finally(() => {
                // save last block to config
            });
    });
};
