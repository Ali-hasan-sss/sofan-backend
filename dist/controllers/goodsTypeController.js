"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoodsTypeController = void 0;
const goodsTypeService_1 = require("../services/goodsTypeService");
exports.GoodsTypeController = {
    list: async (_req, res) => {
        const goodsTypes = await goodsTypeService_1.goodsTypeService.list();
        res.json(goodsTypes);
    },
    listPublic: async (_req, res) => {
        const goodsTypes = await goodsTypeService_1.goodsTypeService.listActive();
        res.json(goodsTypes);
    },
    create: async (req, res) => {
        const goodsType = await goodsTypeService_1.goodsTypeService.create(req.body);
        res.status(201).json(goodsType);
    },
    update: async (req, res) => {
        const goodsType = await goodsTypeService_1.goodsTypeService.update(req.params.id, req.body);
        res.json(goodsType);
    },
    remove: async (req, res) => {
        const result = await goodsTypeService_1.goodsTypeService.remove(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=goodsTypeController.js.map