import { Request, Response, NextFunction } from 'express';

/** Validate the analyze request body */
export function validateAnalyzeRequest(req: Request, res: Response, next: NextFunction): void {
  const { customerName, phoneNumber, vehicleModel, vehicleYear, mileage, problemDescription } = req.body;

  const errors: string[] = [];

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    errors.push('Customer name is required');
  }

  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0) {
    errors.push('Phone number is required');
  }

  if (!vehicleModel || typeof vehicleModel !== 'string' || vehicleModel.trim().length === 0) {
    errors.push('Vehicle model is required');
  }

  if (!vehicleYear || typeof vehicleYear !== 'number' || vehicleYear < 1900 || vehicleYear > new Date().getFullYear() + 1) {
    errors.push('Valid vehicle year is required');
  }

  if (mileage === undefined || typeof mileage !== 'number' || mileage < 0) {
    errors.push('Valid mileage is required');
  }

  if (!problemDescription || typeof problemDescription !== 'string' || problemDescription.trim().length < 10) {
    errors.push('Problem description must be at least 10 characters');
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
}

/** Validate status update request */
export function validateStatusUpdate(req: Request, res: Response, next: NextFunction): void {
  const { status } = req.body;
  const validStatuses = ['NEW', 'IN_REVIEW', 'ASSIGNED', 'COMPLETED'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  next();
}
