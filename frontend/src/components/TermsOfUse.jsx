import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TermsOfUse = () => {
  const [content, setContent] = useState('กำลังโหลด...');

  useEffect(() => {
    axios
      .get(`${API_BASE}/info/terms`)
      .then((response) => {
        const html = response.data.termsOfUse.replace(/\n/g, '<br/>');
        setContent(DOMPurify.sanitize(html));
      })
      .catch(() => setContent('ไม่สามารถโหลดข้อตกลงการใช้งานได้'));
  }, []);

  return (
    <article className="card">
      <h1>ข้อตกลงการใช้งาน</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default TermsOfUse;
