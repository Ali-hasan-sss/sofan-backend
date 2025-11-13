"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationService = void 0;
const mongoose_1 = require("mongoose");
const Province_1 = require("../models/Province");
const District_1 = require("../models/District");
const Village_1 = require("../models/Village");
const Branch_1 = require("../models/Branch");
const locationSchemas_1 = require("../validators/locationSchemas");
const env_1 = require("../config/env");
const toObjectId = (value) => value ? new mongoose_1.Types.ObjectId(value) : undefined;
const ensureBranchExists = async (branchId) => {
    if (!branchId)
        return undefined;
    const branch = await Branch_1.BranchModel.findById(branchId, { _id: 1 });
    if (!branch) {
        const error = new Error("Branch not found");
        error.status = 404;
        throw error;
    }
    return branch.id;
};
exports.locationService = {
    listHierarchy: async () => {
        const provinces = await Province_1.ProvinceModel.find().sort({ name: 1 }).lean();
        const provinceIds = provinces.map((province) => province._id);
        const districts = await District_1.DistrictModel.find({
            province: { $in: provinceIds },
        })
            .sort({ name: 1 })
            .lean();
        const districtIds = districts.map((district) => district._id);
        const villages = await Village_1.VillageModel.find({
            district: { $in: districtIds },
        })
            .sort({ name: 1 })
            .lean();
        const branchIds = [
            ...districts.map((district) => district.branch).filter(Boolean),
            ...villages.map((village) => village.branch).filter(Boolean),
        ];
        const uniqueBranchIds = Array.from(new Set(branchIds.map((id) => id.toString())));
        const branches = uniqueBranchIds.length > 0
            ? await Branch_1.BranchModel.find({ _id: { $in: uniqueBranchIds } }, { name: 1, code: 1 }).lean()
            : [];
        const branchMap = new Map(branches.map((branch) => [branch._id.toString(), branch]));
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
        }, new Map());
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
        }, new Map());
        return provinces.map((province) => ({
            id: province._id.toString(),
            name: province.name,
            code: province.code,
            country: province.country,
            districts: districtsByProvince.get(province._id.toString()) ?? [],
        }));
    },
    createProvince: async (payload) => {
        const data = locationSchemas_1.createProvinceSchema.parse(payload);
        const province = await Province_1.ProvinceModel.create({
            name: data.name,
            code: data.code,
            country: data.country ?? env_1.env.DEFAULT_COUNTRY,
        });
        return {
            id: province.id.toString(),
            name: province.name,
            code: province.code,
            country: province.country,
        };
    },
    updateProvince: async (id, payload) => {
        const data = locationSchemas_1.updateProvinceSchema.parse(payload);
        const province = await Province_1.ProvinceModel.findByIdAndUpdate(id, {
            $set: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.code !== undefined ? { code: data.code } : {}),
                ...(data.country !== undefined ? { country: data.country } : {}),
            },
        }, { new: true });
        if (!province) {
            const error = new Error("Province not found");
            error.status = 404;
            throw error;
        }
        return {
            id: province.id.toString(),
            name: province.name,
            code: province.code,
            country: province.country,
        };
    },
    deleteProvince: async (id) => {
        const province = await Province_1.ProvinceModel.findById(id);
        if (!province) {
            const error = new Error("Province not found");
            error.status = 404;
            throw error;
        }
        const districts = await District_1.DistrictModel.find({ province: id }, { _id: 1 });
        const districtIds = districts.map((district) => district._id);
        await Village_1.VillageModel.deleteMany({ district: { $in: districtIds } });
        await District_1.DistrictModel.deleteMany({ province: id });
        await Province_1.ProvinceModel.deleteOne({ _id: id });
        return { id, deleted: true };
    },
    createDistrict: async (payload) => {
        const data = locationSchemas_1.createDistrictSchema.parse(payload);
        const province = await Province_1.ProvinceModel.findById(data.provinceId);
        if (!province) {
            const error = new Error("Province not found");
            error.status = 404;
            throw error;
        }
        const branchId = await ensureBranchExists(data.branchId);
        const district = await District_1.DistrictModel.create({
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
    updateDistrict: async (id, payload) => {
        const data = locationSchemas_1.updateDistrictSchema.parse(payload);
        if (data.provinceId) {
            const provinceExists = await Province_1.ProvinceModel.exists({
                _id: data.provinceId,
            });
            if (!provinceExists) {
                const error = new Error("Province not found");
                error.status = 404;
                throw error;
            }
        }
        const branchId = await ensureBranchExists(data.branchId);
        const district = await District_1.DistrictModel.findByIdAndUpdate(id, {
            $set: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.code !== undefined ? { code: data.code } : {}),
                ...(data.provinceId !== undefined
                    ? { province: toObjectId(data.provinceId) }
                    : {}),
                ...(data.branchId !== undefined ? { branch: branchId } : {}),
            },
        }, { new: true });
        if (!district) {
            const error = new Error("District not found");
            error.status = 404;
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
    deleteDistrict: async (id) => {
        const district = await District_1.DistrictModel.findById(id);
        if (!district) {
            const error = new Error("District not found");
            error.status = 404;
            throw error;
        }
        await Village_1.VillageModel.deleteMany({ district: id });
        await District_1.DistrictModel.deleteOne({ _id: id });
        return { id, deleted: true };
    },
    createVillage: async (payload) => {
        const data = locationSchemas_1.createVillageSchema.parse(payload);
        const district = await District_1.DistrictModel.findById(data.districtId);
        if (!district) {
            const error = new Error("District not found");
            error.status = 404;
            throw error;
        }
        const branchId = await ensureBranchExists(data.branchId);
        const village = await Village_1.VillageModel.create({
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
    updateVillage: async (id, payload) => {
        const data = locationSchemas_1.updateVillageSchema.parse(payload);
        if (data.districtId) {
            const districtExists = await District_1.DistrictModel.exists({
                _id: data.districtId,
            });
            if (!districtExists) {
                const error = new Error("District not found");
                error.status = 404;
                throw error;
            }
        }
        const branchId = await ensureBranchExists(data.branchId);
        const village = await Village_1.VillageModel.findByIdAndUpdate(id, {
            $set: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.code !== undefined ? { code: data.code } : {}),
                ...(data.districtId !== undefined
                    ? { district: toObjectId(data.districtId) }
                    : {}),
                ...(data.branchId !== undefined ? { branch: branchId } : {}),
            },
        }, { new: true });
        if (!village) {
            const error = new Error("Village not found");
            error.status = 404;
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
    deleteVillage: async (id) => {
        const village = await Village_1.VillageModel.findById(id);
        if (!village) {
            const error = new Error("Village not found");
            error.status = 404;
            throw error;
        }
        await Village_1.VillageModel.deleteOne({ _id: id });
        return { id, deleted: true };
    },
    findBranchForVillage: async (villageId) => {
        if (!villageId)
            return undefined;
        const village = await Village_1.VillageModel.findById(villageId);
        if (!village) {
            const error = new Error("Village not found");
            error.status = 404;
            throw error;
        }
        if (village.branch) {
            return village.branch.toString();
        }
        const district = await District_1.DistrictModel.findById(village.district);
        if (district?.branch) {
            return district.branch.toString();
        }
        return undefined;
    },
};
//# sourceMappingURL=locationService.js.map