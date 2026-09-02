import app from './app';
import { config } from './config/environment';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🚗 AI Service Assistant Backend`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log(`   Gemini API: ${config.geminiApiKey ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`   Firebase:   ${config.firebase.projectId ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`   n8n:        ${config.n8nWebhookUrl ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log('');
});
