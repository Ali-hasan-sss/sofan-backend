import { Types } from "mongoose";
import { ProvinceModel } from "../models/Province";
import { DistrictModel } from "../models/District";
import { VillageModel } from "../models/Village";
import { BranchModel } from "../models/Branch";
import {
  createProvinceSchema,
  updateProvinceSchema,
  createDistrictSchema,
  updateDistrictSchema,
  createVillageSchema,
  updateVillageSchema,
} from "../validators/locationSchemas";
import { env } from "../config/env";

const toObjectId = (value?: string) =>
  value ? new Types.ObjectId(value) : undefined;

const ensureBranchExists = async (branchId?: string) => {
  if (!branchId) return undefined;
  const branch = await BranchModel.findById(branchId, { _id: 1 });
  if (!branch) {
    const error = new Error("Branch not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }
  return branch.id;
};

export const locationService = {
  listHierarchy: async () => {
    const provinces = await ProvinceModel.find().sort({ name: 1 }).lean();

    const provinceIds = provinces.map((province) => province._id);
    const districts = await DistrictModel.find({
      province: { $in: provinceIds },
    })
      .sort({ name: 1 })
      .lean();

    const districtIds = districts.map((district) => district._id);
    const villages = await VillageModel.find({
      district: { $in: districtIds },
    })
      .sort({ name: 1 })
      .lean();

    const branchIds = [
      ...districts.map((district) => district.branch).filter(Boolean),
      ...villages.map((village) => village.branch).filter(Boolean),
    ] as Types.ObjectId[];
    const uniqueBranchIds = Array.from(
      new Set(branchIds.map((id) => id.toString()))
    );

    const branches =
      uniqueBranchIds.length > 0
        ? await BranchModel.find(
            { _id: { $in: uniqueBranchIds } },
            { name: 1, code: 1 }
          ).lean()
        : [];

    const branchMap = new Map(
      branches.map((branch) => [branch._id.toString(), branch])
    );

    const villagesByDistrict = villages.reduce((acc, village) => {
      const districtId = village.district.toString();
      if (!acc.has(districtId)) {
        acc.set(districtId, []);
      }
      acc.get(districtId)?.push({
        id: village._id.toString(),
        name: village.name,
        code: village.code,
        branch: village.branch
          ? {
              id: village.branch.toString(),
              name: branchMap.get(village.branch.toString())?.name ?? "",
              code: branchMap.get(village.branch.toString())?.code,
            }
          : undefined,
      });
      return acc;
    }, new Map<string, Array<Record<string, unknown>>>());

    const districtsByProvince = districts.reduce((acc, district) => {
      const provinceId = district.province.toString();
      if (!acc.has(provinceId)) {
        acc.set(provinceId, []);
      }
      acc.get(provinceId)?.push({
        id: district._id.toString(),
        name: district.name,
        code: district.code,
        branch: district.branch
          ? {
              id: district.branch.toString(),
              name: branchMap.get(district.branch.toString())?.name ?? "",
              code: branchMap.get(district.branch.toString())?.code,
            }
          : undefined,
        villages: villagesByDistrict.get(district._id.toString()) ?? [],
      });
      return acc;
    }, new Map<string, Array<Record<string, unknown>>>());

    return provinces.map((province) => ({
      id: province._id.toString(),
      name: province.name,
      code: province.code,
      country: province.country,
      districts: districtsByProvince.get(province._id.toString()) ?? [],
    }));
  },

  createProvince: async (payload: unknown) => {
    const data = createProvinceSchema.parse(payload);
    const province = await ProvinceModel.create({
      name: data.name,
      code: data.code,
      country: data.country ?? env.DEFAULT_COUNTRY,
    });
    return {
      id: province.id.toString(),
      name: province.name,
      code: province.code,
      country: province.country,
    };
  },

  updateProvince: async (id: string, payload: unknown) => {
    const data = updateProvinceSchema.parse(payload);
    const province = await ProvinceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.country !== undefined ? { country: data.country } : {}),
        },
      },
      { new: true }
    );

    if (!province) {
      const error = new Error("Province not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return {
      id: province.id.toString(),
      name: province.name,
      code: province.code,
      country: province.country,
    };
  },

  deleteProvince: async (id: string) => {
    const province = await ProvinceModel.findById(id);
    if (!province) {
      const error = new Error("Province not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const districts = await DistrictModel.find({ province: id }, { _id: 1 });
    const districtIds = districts.map((district) => district._id);

    await VillageModel.deleteMany({ district: { $in: districtIds } });
    await DistrictModel.deleteMany({ province: id });
    await ProvinceModel.deleteOne({ _id: id });

    return { id, deleted: true };
  },

  createDistrict: async (payload: unknown) => {
    const data = createDistrictSchema.parse(payload);

    const province = await ProvinceModel.findById(data.provinceId);
    if (!province) {
      const error = new Error("Province not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const branchId = await ensureBranchExists(data.branchId);

    const district = await DistrictModel.create({
      name: data.name,
      code: data.code,
      province: data.provinceId,
      branch: branchId,
    });

    return {
      id: district.id.toString(),
      name: district.name,
      code: district.code,
      provinceId: district.province.toString(),
      branchId: branchId ?? undefined,
    };
  },

  updateDistrict: async (id: string, payload: unknown) => {
    const data = updateDistrictSchema.parse(payload);

    if (data.provinceId) {
      const provinceExists = await ProvinceModel.exists({
        _id: data.provinceId,
      });
      if (!provinceExists) {
        const error = new Error("Province not found");
        (error as Error & { status?: number }).status = 404;
        throw error;
      }
    }

    const branchId = await ensureBranchExists(data.branchId);

    const district = await DistrictModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.provinceId !== undefined
            ? { province: toObjectId(data.provinceId) }
            : {}),
          ...(data.branchId !== undefined ? { branch: branchId } : {}),
        },
      },
      { new: true }
    );

    if (!district) {
      const error = new Error("District not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return {
      id: district.id.toString(),
      name: district.name,
      code: district.code,
      provinceId: district.province.toString(),
      branchId: district.branch ? district.branch.toString() : undefined,
    };
  },

  deleteDistrict: async (id: string) => {
    const district = await DistrictModel.findById(id);
    if (!district) {
      const error = new Error("District not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    await VillageModel.deleteMany({ district: id });
    await DistrictModel.deleteOne({ _id: id });

    return { id, deleted: true };
  },

  createVillage: async (payload: unknown) => {
    const data = createVillageSchema.parse(payload);

    const district = await DistrictModel.findById(data.districtId);
    if (!district) {
      const error = new Error("District not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const branchId = await ensureBranchExists(data.branchId);

    const village = await VillageModel.create({
      name: data.name,
      code: data.code,
      district: data.districtId,
      branch: branchId,
    });

    return {
      id: village.id.toString(),
      name: village.name,
      code: village.code,
      districtId: village.district.toString(),
      branchId: branchId ?? undefined,
    };
  },

  updateVillage: async (id: string, payload: unknown) => {
    const data = updateVillageSchema.parse(payload);

    if (data.districtId) {
      const districtExists = await DistrictModel.exists({
        _id: data.districtId,
      });
      if (!districtExists) {
        const error = new Error("District not found");
        (error as Error & { status?: number }).status = 404;
        throw error;
      }
    }

    const branchId = await ensureBranchExists(data.branchId);

    const village = await VillageModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.districtId !== undefined
            ? { district: toObjectId(data.districtId) }
            : {}),
          ...(data.branchId !== undefined ? { branch: branchId } : {}),
        },
      },
      { new: true }
    );

    if (!village) {
      const error = new Error("Village not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return {
      id: village.id.toString(),
      name: village.name,
      code: village.code,
      districtId: village.district.toString(),
      branchId: village.branch ? village.branch.toString() : undefined,
    };
  },

  deleteVillage: async (id: string) => {
    const village = await VillageModel.findById(id);
    if (!village) {
      const error = new Error("Village not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    await VillageModel.deleteOne({ _id: id });

    return { id, deleted: true };
  },

  findBranchForVillage: async (villageId?: string) => {
    if (!villageId) return undefined;
    const village = await VillageModel.findById(villageId);
    if (!village) {
      const error = new Error("Village not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    if (village.branch) {
      return village.branch.toString();
    }
    const district = await DistrictModel.findById(village.district);
    if (district?.branch) {
      return district.branch.toString();
    }
    return undefined;
  },
};
