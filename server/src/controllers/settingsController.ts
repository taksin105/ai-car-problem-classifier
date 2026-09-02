import { Request, Response, NextFunction } from 'express';
import { getWebhookUrl, setWebhookUrl, sendTestWebhook } from '../services/settingsService';

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const webhookUrl = await getWebhookUrl();
    res.json({
      success: true,
      data: {
        webhookUrl,
        isConfigured: !!webhookUrl,
        provider: webhookUrl.includes('discord.com') ? 'Discord' : (webhookUrl ? 'Custom Webhook / n8n' : 'None'),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { webhookUrl } = req.body;
    const updatedUrl = await setWebhookUrl(webhookUrl);
    res.json({
      success: true,
      message: 'บันทึกการตั้งค่า Webhook สำเร็จ',
      data: {
        webhookUrl: updatedUrl,
        isConfigured: !!updatedUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function testWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { webhookUrl } = req.body;
    const result = await sendTestWebhook(webhookUrl);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'ไม่สามารถส่งข้อความทดสอบเข้า Discord ได้',
    });
  }
}
