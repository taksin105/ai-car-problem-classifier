import { useEffect, useState } from 'react';
import {
  Bell,
  Radio,
  Send,
  Save,
  Eye,
  EyeOff,
  Copy,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import { Toast } from '../components/ui/Toast';
import { getSettings, updateSettings, testWebhook } from '../services/api';

export function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setWebhookUrl(data.webhookUrl || '');
      setIsConfigured(data.isConfigured);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'ไม่สามารถโหลดการตั้งค่าได้',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateSettings(webhookUrl);
      setIsConfigured(res.isConfigured);
      setToast({ message: 'บันทึกการตั้งค่า Discord Webhook สำเร็จแล้ว!', type: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึก',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!webhookUrl.trim()) {
      setToast({ message: 'กรุณากรอก Discord Webhook URL ก่อนกดทดสอบ', type: 'error' });
      return;
    }
    try {
      setTesting(true);
      const res = await testWebhook(webhookUrl);
      setToast({ message: res.message || 'ส่งการ์ดทดสอบเข้า Discord เรียบร้อยแล้ว!', type: 'success' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'ส่งข้อความทดสอบไม่สำเร็จ กรุณาตรวจสอบ URL',
        type: 'error',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="pb-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">System & Webhook Settings</h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
              Real-time Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดและเปลี่ยน Discord Webhook URL เพื่อรับการแจ้งเตือนเคสรถยนต์ฉุกเฉินได้ทันทีจากหน้าเว็บ
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>รีเฟรชสถานะ</span>
        </button>
      </div>

      {/* Connection Status Card */}
      <div className={`p-5 rounded-2xl border shadow-xs transition-all ${
        isConfigured && webhookUrl
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-500/30'
          : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConfigured && webhookUrl ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'} shadow-2xs`}>
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isConfigured && webhookUrl ? 'Discord Webhook: เชื่อมต่อสำเร็จ (Connected)' : 'Discord Webhook: ยังไม่ได้ตั้งค่า URL'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {isConfigured && webhookUrl
                  ? 'เมื่อมีเคสวิเคราะห์ใหม่ ระบบจะส่งการ์ดแจ้งเตือนเข้าห้อง Discord ของคุณอัตโนมัติ'
                  : 'กรุณากรอก Discord Webhook URL ด้านล่างเพื่อเริ่มรับการแจ้งเตือน'}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isConfigured && webhookUrl
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {isConfigured && webhookUrl ? '🟢 Active' : '🟡 Inactive'}
          </span>
        </div>
      </div>

      {/* Webhook Configuration Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">กำหนด Discord Webhook URL</h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Discord Webhook URL *
            </label>
            <div className="relative">
              <input
                type={showUrl ? 'text' : 'password'}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/1234567890/abcdef..."
                className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowUrl(!showUrl)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                  title={showUrl ? 'ซ่อน URL' : 'แสดง URL'}
                >
                  {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {webhookUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      setToast({ message: 'คัดลอก URL เรียบร้อย', type: 'success' });
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="คัดลอก URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              💡 ระบบรองรับทั้ง Discord Webhook และ n8n Webhook URL
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !webhookUrl.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              {testing ? (
                <>
                  <Spinner size="sm" />
                  <span>กำลังทดสอบส่ง Alert...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-blue-600" />
                  <span>🧪 ทดสอบส่งการ์ดแจ้งเตือน (Send Test Alert)</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Spinner size="sm" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>💾 บันทึกการตั้งค่า (Save Webhook)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Step-by-Step Guide: How to create Discord Webhook */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">วิธีสร้าง Discord Webhook ใน 3 ขั้นตอน (How to get Webhook URL)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900">เปิดการตั้งค่าห้องใน Discord</h3>
            <p className="text-slate-600 leading-relaxed">
              ไปที่ห้องแชท (Text Channel) ที่ต้องการให้แจ้งเตือน คลิกไอคอนฟันเฟือง <strong>Edit Channel (แก้ไขห้อง)</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900">สร้าง Webhook</h3>
            <p className="text-slate-600 leading-relaxed">
              เลือกแท็บ <strong>Integrations (การรวม)</strong> ➔ คลิก <strong>Webhooks (เว็บฮุก)</strong> ➔ กดปุ่ม <strong>New Webhook</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900">คัดลอก URL มาวาง</h3>
            <p className="text-slate-600 leading-relaxed">
              กดปุ่ม <strong>Copy Webhook URL</strong> แล้วนำมาวางในช่องด้านบน จากนั้นกดบันทึกและกดทดสอบได้ทันที!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
