'use strict';
const { SuccessResponse } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")


class InventoryController {
    addStockToInventory = async (req, res) => {
        new SuccessResponse({
            message: 'add stock Success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()