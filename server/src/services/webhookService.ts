import { config } from '../config/environment';
import { ServiceCase } from '../types';

/** Send case data to n8n or Discord webhook */
export async function triggerN8nWebhook(serviceCase: ServiceCase): Promise<boolean> {
  if (!config.n8nWebhookUrl) {
    console.warn('N8N_WEBHOOK_URL not configured. Skipping webhook.');
    return false;
  }

  try {
    const isDiscord = config.n8nWebhookUrl.includes('discord.com/api/webhooks');

    let bodyPayload: any;

    if (isDiscord) {
      const isHigh = serviceCase.urgency === 'HIGH';
      const isMedium = serviceCase.urgency === 'MEDIUM';
      
      const embedColor = isHigh ? 15158332 : (isMedium ? 16763904 : 3066993);
      const headerTitle = isHigh
        ? '🚨 **[URGENT] High Priority Vehicle Case Alert!**'
        : (isMedium ? '⚠️ **[MEDIUM] Vehicle Service Case Received**' : '📋 **[NORMAL] New Vehicle Service Case**');

      bodyPayload = {
        content: isHigh ? `@everyone ${headerTitle}` : headerTitle,
        embeds: [
          {
            title: `🔧 Category: ${serviceCase.category} (${serviceCase.urgency} Urgency)`,
            description: `**Summary:** ${serviceCase.summary}`,
            color: embedColor,
            fields: [
              {
                name: '👤 Customer',
                value: `${serviceCase.customerName}\n📞 ${serviceCase.phoneNumber}`,
                inline: true,
              },
              {
                name: '🚗 Vehicle',
                value: `${serviceCase.vehicleModel} (${serviceCase.vehicleYear})\n🛣️ ${serviceCase.mileage?.toLocaleString() || 0} km`,
                inline: true,
              },
              {
                name: '🎯 AI Confidence',
                value: `${Math.round(serviceCase.confidence * 100)}%`,
                inline: true,
              },
              {
                name: '💰 Estimated Cost',
                value: serviceCase.estimatedCost || '฿1,000 - ฿3,000 (ประเมินหน้างาน)',
                inline: true,
              },
              {
                name: '⏱️ Estimated Repair Time',
                value: serviceCase.estimatedRepairTime || '1 - 2 ชั่วโมง',
                inline: true,
              },
              {
                name: '📝 Problem Reported',
                value: serviceCase.problemDescription,
              },
              {
                name: '💡 AI Recommendation',
                value: serviceCase.recommendation,
              },
              ...(serviceCase.followUpQuestions && serviceCase.followUpQuestions.length > 0
                ? [
                    {
                      name: '❓ Follow-up Questions for Advisor',
                      value: serviceCase.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n'),
                    },
                  ]
                : []),
            ],
            footer: {
              text: `Case ID: ${serviceCase.id} • AI Service Assistant`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else {
      // Standard n8n JSON payload
      bodyPayload = {
        caseId: serviceCase.id,
        customerName: serviceCase.customerName,
        phoneNumber: serviceCase.phoneNumber,
        vehicleModel: serviceCase.vehicleModel,
        vehicleYear: serviceCase.vehicleYear,
        mileage: serviceCase.mileage,
        problemDescription: serviceCase.problemDescription,
        category: serviceCase.category,
        urgency: serviceCase.urgency,
        confidence: serviceCase.confidence,
        summary: serviceCase.summary,
        symptoms: serviceCase.symptoms,
        possibleCauses: serviceCase.possibleCauses,
        followUpQuestions: serviceCase.followUpQuestions,
        recommendation: serviceCase.recommendation,
        requiresImmediateAttention: serviceCase.requiresImmediateAttention,
        estimatedCost: serviceCase.estimatedCost,
        estimatedRepairTime: serviceCase.estimatedRepairTime,
        status: serviceCase.status,
        createdAt: serviceCase.createdAt,
      };
    }

    const response = await fetch(config.n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    console.log('Webhook triggered successfully (Discord/n8n)');
    return true;
  } catch (error) {
    console.error('Failed to trigger webhook:', error);
    throw error;
  }
}
