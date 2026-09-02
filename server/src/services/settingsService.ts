import { db } from '../config/firebase';
import { config } from '../config/environment';

let runtimeWebhookUrl: string = config.n8nWebhookUrl;

/** Get currently active webhook URL */
export async function getWebhookUrl(): Promise<string> {
  try {
    if (db) {
      const doc = await db.collection('systemSettings').doc('webhook').get();
      if (doc.exists) {
        const data = doc.data();
        if (data && typeof data.url === 'string') {
          runtimeWebhookUrl = data.url;
          return data.url;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch webhook from Firestore, using runtime config:', err);
  }
  return runtimeWebhookUrl || config.n8nWebhookUrl;
}

/** Update active webhook URL in Firestore and memory */
export async function setWebhookUrl(newUrl: string): Promise<string> {
  const trimmedUrl = (newUrl || '').trim();
  runtimeWebhookUrl = trimmedUrl;
  config.n8nWebhookUrl = trimmedUrl;

  try {
    if (db) {
      await db.collection('systemSettings').doc('webhook').set({
        url: trimmedUrl,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Could not persist webhook to Firestore:', err);
  }

  return trimmedUrl;
}

/** Send a test notification to Discord */
export async function sendTestWebhook(targetUrl?: string): Promise<{ success: boolean; message: string }> {
  const url = (targetUrl || await getWebhookUrl()).trim();
  if (!url) {
    throw new Error('กรุณาระบุ Discord Webhook URL ก่อนทดสอบ');
  }

  const isDiscord = url.includes('discord.com/api/webhooks');

  const testPayload = isDiscord
    ? {
        content: '🧪 **[TEST] AutoTech AI System Webhook Connection Verified!**',
        embeds: [
          {
            title: '✅ Discord Webhook Integration Successful',
            description: 'ระบบ AutoTech AI เชื่อมต่อกับห้อง Discord นี้เรียบร้อยแล้ว การแจ้งเตือนเคสจริงจะถูกส่งเข้ามาที่นี่แบบ Real-time',
            color: 3066993, // Green
            fields: [
              {
                name: '🤖 AI Model',
                value: 'Gemini 3.6 Flash',
                inline: true,
              },
              {
                name: '🌐 Status',
                value: 'Online & Ready',
                inline: true,
              },
              {
                name: '🕒 Timestamp',
                value: new Date().toLocaleString('th-TH'),
                inline: true,
              },
            ],
            footer: {
              text: 'AutoTech AI • Vehicle Triage Assistant',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }
    : {
        event: 'TEST_WEBHOOK',
        message: 'AutoTech AI Webhook Test Successful',
        timestamp: new Date().toISOString(),
      };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Discord Webhook ตอบกลับด้วยสถานะ HTTP ${response.status} กรุณาตรวจสอบ URL ให้ถูกต้อง`);
  }

  return { success: true, message: 'ส่งข้อความทดสอบเข้า Discord สำเร็จแล้ว!' };
}
