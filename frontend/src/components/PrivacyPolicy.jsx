import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('กำลังโหลด...');

  useEffect(() => {
    axios
      .get(`${API_BASE}/info/policy`)
      .then((response) => {
        const html = response.data.privacyPolicy.replace(/\n/g, '<br/>');
        setContent(DOMPurify.sanitize(html));
      })
      .catch(() => setContent('ไม่สามารถโหลดนโยบายความเป็นส่วนตัวได้'));
  }, []);

  return (
    <article className="card">
      <h1>นโยบายความเป็นส่วนตัว</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default PrivacyPolicy;
