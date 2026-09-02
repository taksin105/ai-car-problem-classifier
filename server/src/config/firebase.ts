import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './environment';

if (getApps().length === 0) {
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase credentials not configured. Running without Firestore.');
    // Initialize without credentials for development
    initializeApp({ projectId: 'demo-project' });
  }
}

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
