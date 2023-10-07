const { unSelectData, getSelectData } = require("../../utils");


const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .skip(skip)
        .sort(sortBy)
        .limit(limit)
        .select(unSelectData(unSelect))
        .lean()
    return documents
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .skip(skip)
        .sort(sortBy)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return documents
}

const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter)
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists
}