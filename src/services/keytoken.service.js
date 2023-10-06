'use strict';

const { Types } = require("mongoose");
const keyModel = require("../models/key.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error.message;
        }
    }
    static findByUserId = async (userId) => {
        return await keyModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }
    static removeKeyById = async (id) => {
        return await keyModel.remove(id)
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keyModel.findOne({ refreshToken }).lean()
    }
    static deleteKeyById = async (userId) => {
        return await keyModel.deleteOne({ user: userId })
    }
}
module.exports = KeyTokenService