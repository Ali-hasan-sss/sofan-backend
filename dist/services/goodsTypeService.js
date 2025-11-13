"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsTypeService = void 0;
const GoodsType_1 = require("../models/GoodsType");
const goodsTypeSchemas_1 = require("../validators/goodsTypeSchemas");
const httpError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
const mapGoodsType = (doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description ?? "",
    isActive: doc.isActive ?? true,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});
exports.goodsTypeService = {
    list: async () => {
        const goodsTypes = await GoodsType_1.GoodsTypeModel.find().sort({ name: 1 }).lean();
        return goodsTypes.map(mapGoodsType);
    },
    listActive: async () => {
        const goodsTypes = await GoodsType_1.GoodsTypeModel.find({ isActive: true })
            .sort({ name: 1 })
            .lean();
        return goodsTypes.map(mapGoodsType);
    },
    create: async (payload) => {
        const data = goodsTypeSchemas_1.goodsTypeCreateSchema.parse(payload);
        const existing = await GoodsType_1.GoodsTypeModel.findOne({
            name: data.name.trim(),
        });
        if (existing) {
            throw httpError("Goods type name already exists", 409);
        }
        const goodsType = await GoodsType_1.GoodsTypeModel.create({
            name: data.name.trim(),
            description: data.description,
            isActive: data.isActive ?? true,
        });
        return mapGoodsType(goodsType.toObject());
    },
    update: async (id, payload) => {
        const data = goodsTypeSchemas_1.goodsTypeUpdateSchema.parse(payload);
        if (data.name) {
            const duplicate = await GoodsType_1.GoodsTypeModel.findOne({
                _id: { $ne: id },
                name: data.name.trim(),
            });
            if (duplicate) {
                throw httpError("Goods type name already exists", 409);
            }
        }
        const goodsType = await GoodsType_1.GoodsTypeModel.findByIdAndUpdate(id, {
            $set: {
                ...(data.name !== undefined ? { name: data.name.trim() } : {}),
                ...(data.description !== undefined
                    ? { description: data.description }
                    : {}),
                ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
            },
        }, { new: true }).lean();
        if (!goodsType) {
            throw httpError("Goods type not found", 404);
        }
        return mapGoodsType(goodsType);
    },
    remove: async (id) => {
        const goodsType = await GoodsType_1.GoodsTypeModel.findByIdAndDelete(id).lean();
        if (!goodsType) {
            throw httpError("Goods type not found", 404);
        }
        return { id, deleted: true };
    },
};
//# sourceMappingURL=goodsTypeService.js.map