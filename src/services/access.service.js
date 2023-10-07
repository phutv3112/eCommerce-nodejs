'use strict';
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair, verifyJwt } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError } = require('../core/error.response');
const { findShopByEmail } = require('./shop.service');
const keyModel = require('../models/key.model');

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Shop already exists!')
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })
            if (newShop) {
                const privateKey = crypto.getRandomValues(64).toString('hex')
                const publicKey = crypto.getRandomValues(64).toString('hex')
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id, publicKey, privateKey
                })
                if (!keyStore) {
                    throw new BadRequestError()
                }
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                return {
                    code: 201,
                    message: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                message: 'Register successfully!'
            }
        } catch (error) {
            return error
        }
    }
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findShopByEmail({ email })
        if (!foundShop) throw new NotFoundError('Shop not found!')
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new BadRequestError('Authentication failed')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id,
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log('delKey:::', delKey)
        return delKey
    }
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong!')
        }
        if (keyStore.refreshToken !== refreshToken) {
            throw new UnauthorizedError('Shop not registered!')
        }
        const foundShop = await findShopByEmail({ email })
        const tokens = await createTokenPair({ userId: foundShop._id, email }, keyStore.publicKey, keyStore.privateKey)
        await keyModel.findOneAndUpdate({ _id: keyStore._id }, {
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user: { userId, email },
            tokens
        }
    }
}

module.exports = AccessService