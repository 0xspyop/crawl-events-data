import { IToken } from "./token";
import TokenSchema from "./token";
export const updateToken = async (tokenId: number, data: IToken) => {
    await TokenSchema.findOneAndUpdate({ tokenId }, data, { upsert: true });
};
