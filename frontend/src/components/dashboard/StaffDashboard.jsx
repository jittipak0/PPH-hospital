import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext.jsx';

const StaffDashboard = () => {
  const { authorizedRequest } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    authorizedRequest({ url: '/staff/announcements', method: 'get' })
      .then((response) => setAnnouncements(response.data.announcements))
      .catch(() => setAnnouncements([]));
  }, [authorizedRequest]);

  return (
    <section className="card">
      <h2>ข่าวสารภายในองค์กร</h2>
      <div>
        {announcements.map((item) => (
          <article key={item.id} style={{ marginBottom: '1.5rem' }}>
            <h3>{item.title}</h3>
            <div style={{ fontSize: '0.85rem', color: '#607d8b' }}>{item.createdAt}</div>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default StaffDashboard;
