'use strict';
const _ = require('lodash');
const { Types: { ObjectId } } = require('mongoose');

const convertToObjectIdMongoDB = id => new ObjectId(id)
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}
const removeUndefineData = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k];
        }
    })
    return obj
}

const updateNestedObjectParse = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParse(obj[key])
            Object.keys(response || {}).forEach(a => {
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefineData,
    updateNestedObjectParse,
    convertToObjectIdMongoDB
}