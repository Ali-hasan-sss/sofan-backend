import { GoodsTypeModel } from "../models/GoodsType";
import {
  goodsTypeCreateSchema,
  goodsTypeUpdateSchema,
} from "../validators/goodsTypeSchemas";

const httpError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

const mapGoodsType = (doc: any) => ({
  id: doc._id.toString(),
  name: doc.name,
  isActive: doc.isActive ?? true,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const goodsTypeService = {
  list: async () => {
    const goodsTypes = await GoodsTypeModel.find().sort({ name: 1 }).lean();
    return goodsTypes.map(mapGoodsType);
  },

  listActive: async () => {
    const goodsTypes = await GoodsTypeModel.find({ isActive: true })
      .sort({ name: 1 })
      .lean();
    return goodsTypes.map(mapGoodsType);
  },

  create: async (payload: unknown) => {
    const data = goodsTypeCreateSchema.parse(payload);

    const existing = await GoodsTypeModel.findOne({
      name: data.name.trim(),
    });
    if (existing) {
      throw httpError("Goods type name already exists", 409);
    }

    const goodsType = await GoodsTypeModel.create({
      name: data.name.trim(),
      isActive: data.isActive ?? true,
    });

    return mapGoodsType(goodsType.toObject());
  },

  update: async (id: string, payload: unknown) => {
    const data = goodsTypeUpdateSchema.parse(payload);

    if (data.name) {
      const duplicate = await GoodsTypeModel.findOne({
        _id: { $ne: id },
        name: data.name.trim(),
      });
      if (duplicate) {
        throw httpError("Goods type name already exists", 409);
      }
    }

    const goodsType = await GoodsTypeModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(data.name !== undefined ? { name: data.name.trim() } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      },
      { new: true }
    ).lean();

    if (!goodsType) {
      throw httpError("Goods type not found", 404);
    }

    return mapGoodsType(goodsType);
  },

  remove: async (id: string) => {
    const goodsType = await GoodsTypeModel.findByIdAndDelete(id).lean();
    if (!goodsType) {
      throw httpError("Goods type not found", 404);
    }
    return { id, deleted: true };
  },
};
