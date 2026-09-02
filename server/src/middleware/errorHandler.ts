import { Request, Response, NextFunction } from 'express';

/** Global error handler — never expose stack traces to client */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('[Error]', err.message);
  console.error(err.stack);

  // Determine status code
  const statusCode = (err as any).statusCode || 500;

  // User-friendly error messages
  let message = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';

  if (err.message.includes('Gemini') || err.message.includes('AI')) {
    message = 'ไม่สามารถวิเคราะห์ข้อมูลได้ กรุณาตรวจสอบรายละเอียดอาการและลองใหม่อีกครั้ง';
  } else if (err.message.includes('Firebase') || err.message.includes('Firestore')) {
    message = 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
  } else if (err.message.includes('Webhook') || err.message.includes('n8n')) {
    message = 'ไม่สามารถส่งข้อมูลไปยังระบบอัตโนมัติได้';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
