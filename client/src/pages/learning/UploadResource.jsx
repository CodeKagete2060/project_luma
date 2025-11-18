import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/axiosConfig';

const MAX_RESOURCE_SIZE = 25 * 1024 * 1024; // 25MB

export default function UploadResource() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected && selected.size > MAX_RESOURCE_SIZE) {
      alert('File is larger than 25MB. Please upload a smaller resource.');
      event.target.value = '';
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const submit = async () => {
    if (!file) return alert('Choose a file');
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('subject', subject);
    setLoading(true);
    try {
      await api.post('/learning/resources', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Uploaded');
      setFile(null);
      setTitle('');
      setSubject('');
    } catch (err) {
      console.error('upload err', err);
      alert('Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout role={user.role}>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-4 text-primary">Upload Resource</h3>
        <div className="grid gap-4">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-4 py-2 rounded-lg" />
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border px-4 py-2 rounded-lg" />
          <input type="file" onChange={handleFileChange} className="mb-2" />
          <div className="flex justify-end">
            <button onClick={submit} className="px-6 py-2 bg-primary text-white rounded-lg" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
