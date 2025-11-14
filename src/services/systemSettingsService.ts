import {
  SystemSettingsModel,
  type SystemSettingsDocument,
} from "../models/SystemSettings";
import { systemSettingsUpdateSchema } from "../validators/settingsSchemas";

const mapSettings = (doc: SystemSettingsDocument) => ({
  id: doc.id,
  localCurrency: doc.localCurrency ?? null,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const ensureSettings = async () => {
  const existing = await SystemSettingsModel.findOne();
  if (existing) {
    return existing;
  }
  return SystemSettingsModel.create({});
};

export const systemSettingsService = {
  get: async () => {
    const settings = await ensureSettings();
    return mapSettings(settings);
  },

  update: async (payload: unknown) => {
    const data = systemSettingsUpdateSchema.parse(payload);
    const settings = await ensureSettings();

    if (data.localCurrency !== undefined) {
      if (!data.localCurrency) {
        settings.localCurrency = null;
      } else {
        settings.localCurrency = data.localCurrency.toUpperCase();
      }
    }

    await settings.save();
    return mapSettings(settings);
  },
};
