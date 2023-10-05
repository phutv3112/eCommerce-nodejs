'use strict';

const apikeyModel = require("../models/apikey.model");

const findKeyById = async (key) => {
    const key = await apikeyModel.findOne({ key, status: true }).lean()
    return key;
}

module.exports = {
    findKeyById
}