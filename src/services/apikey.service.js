'use strict';

const apikeyModel = require("../models/apikey.model");

const findKeyById = async (key) => {
    const foundKey = await apikeyModel.findOne({ key, status: true }).lean()
    return foundKey;
}

module.exports = {
    findKeyById
}