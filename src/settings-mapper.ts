import { constantsAppSettings } from './const';
import { AppSettings } from './default-settings/schemas/app-settings.schema';

const ADMIN_PANEL_PASSWORD = 'admin_panel_password';
const ENCRYPT_PASSWORD = 'encrypt_password';
const APP_NAME = 'app_name';
const CLOUDINARY_CLOUD_NAME = 'cloudinary_cloud_name';
const CLOUDINARY_API_KEY = 'cloudinary_api_key';
const CLOUDINARY_API_SECRET = 'cloudinary_api_secret';
const STRIPE_SECRET_KEY = 'stripe_secret_key';
const STRIPE_WEBHOOK_SECRET = 'stripe_webhook_secret';
const STRIPE_SUCCESS_URL = 'stripe_success_url';
const STRIPE_CANCEL_URL = 'stripe_cancel_url';

export class SettingsMapper {
  static mapSettings(listSettings: AppSettings[]) {
    const settings = constantsAppSettings;

    for (const setting of listSettings) {
      switch (setting.attribute) {
        case ADMIN_PANEL_PASSWORD:
          settings.adminPanelPassword = setting.value;
          break;
        case ENCRYPT_PASSWORD:
          settings.encryptPassword = setting.value;
          break;
        case APP_NAME:
          settings.appName = setting.value;
          break;
        case CLOUDINARY_CLOUD_NAME:
          settings.cloudinaryCloudName = setting.value;
          break;
        case CLOUDINARY_API_KEY:
          settings.cloudinaryApiKey = setting.value;
          break;
        case CLOUDINARY_API_SECRET:
          settings.cloudinaryApiSecret = setting.value;
          break;
        case STRIPE_SECRET_KEY:
          settings.stripeSecretKey = setting.value;
          break;
        case STRIPE_WEBHOOK_SECRET:
          settings.stripeWebhookSecret = setting.value;
          break;
        case STRIPE_SUCCESS_URL:
          settings.stripeSuccessUrl = setting.value;
          break;
        case STRIPE_CANCEL_URL:
          settings.stripeCancelUrl = setting.value;
          break;
      }
    }
  }
}

