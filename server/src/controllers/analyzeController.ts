import { Request, Response, NextFunction } from 'express';
import { analyzeVehicleProblem } from '../services/geminiService';
import { createCase, createAutomationLog } from '../services/firestoreService';
import { triggerN8nWebhook } from '../services/webhookService';
import { CustomerInput } from '../types';

/** POST /api/analyze — Analyze customer problem, save case, trigger webhook */
export async function analyzeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input: CustomerInput = {
      customerName: req.body.customerName.trim(),
      phoneNumber: req.body.phoneNumber.trim(),
      vehicleModel: req.body.vehicleModel.trim(),
      vehicleYear: req.body.vehicleYear,
      mileage: req.body.mileage,
      problemDescription: req.body.problemDescription.trim(),
    };

    // Step 1: AI Analysis
    const analysis = await analyzeVehicleProblem(input);
    
    // Step 2: Save case to Firestore
    const serviceCase = await createCase({
      ...input,
      ...analysis,
    });

    // Log: Case Created
    await createAutomationLog(serviceCase.id, 'Case Created', 'SUCCESS');

    // Log: AI Analysis Completed
    await createAutomationLog(serviceCase.id, 'AI Analysis Completed', 'SUCCESS', 
      `Category: ${analysis.category}, Urgency: ${analysis.urgency}`);

    // Log: Firestore Saved
    await createAutomationLog(serviceCase.id, 'Firestore Saved', 'SUCCESS');

    // Step 3: Trigger n8n webhook (non-blocking — case is still saved even if webhook fails)
    try {
      const webhookSuccess = await triggerN8nWebhook(serviceCase);
      await createAutomationLog(
        serviceCase.id,
        'n8n Workflow Triggered',
        webhookSuccess ? 'SUCCESS' : 'FAILED',
        webhookSuccess ? undefined : 'Webhook URL not configured'
      );

      if (webhookSuccess && analysis.requiresImmediateAttention) {
        await createAutomationLog(serviceCase.id, 'Service Advisor Notified (HIGH Priority)', 'SUCCESS');
      } else if (webhookSuccess) {
        await createAutomationLog(serviceCase.id, 'Service Advisor Notified', 'SUCCESS');
      }
    } catch (webhookError) {
      console.error('Webhook failed but case was saved:', webhookError);
      await createAutomationLog(
        serviceCase.id,
        'n8n Workflow Triggered',
        'FAILED',
        (webhookError as Error).message
      );
    }

    res.status(201).json({
      success: true,
      data: serviceCase,
    });
  } catch (error) {
    next(error);
  }
}
