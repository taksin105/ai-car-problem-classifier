import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { config } from './environment';
import fs from 'fs';
import path from 'path';

let firestoreInstance: Firestore | null = null;
export let isFirebaseConfigured = false;

if (getApps().length === 0) {
  // Check if serviceAccountKey.json exists in server directory or root
  const possiblePaths = [
    path.join(process.cwd(), 'serviceAccountKey.json'),
    path.join(process.cwd(), 'service-account.json'),
    path.join(__dirname, '../../serviceAccountKey.json'),
  ];
  
  const foundPath = possiblePaths.find(p => fs.existsSync(p));

  if (foundPath) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(foundPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount),
      });
      firestoreInstance = getFirestore();
      firestoreInstance.settings({ ignoreUndefinedProperties: true });
      isFirebaseConfigured = true;
      console.log(`✅ Firebase initialized successfully from file: ${path.basename(foundPath)}`);
    } catch (e) {
      console.error('Failed to parse serviceAccountKey.json:', e);
    }
  } else if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
      });
      firestoreInstance = getFirestore();
      firestoreInstance.settings({ ignoreUndefinedProperties: true });
      isFirebaseConfigured = true;
      console.log('✅ Firebase initialized successfully from environment variables');
    } catch (e) {
      console.error('Failed to initialize Firebase with environment variables:', e);
    }
  } else {
    console.warn('⚠️  Firebase credentials not configured. In-memory storage will be used.');
  }
}

export const db = firestoreInstance;

