import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RoleBadge from '../components/common/RoleBadge.jsx';
import AdminDashboard from '../components/dashboard/AdminDashboard.jsx';
import DoctorDashboard from '../components/dashboard/DoctorDashboard.jsx';
import NurseDashboard from '../components/dashboard/NurseDashboard.jsx';
import StaffDashboard from '../components/dashboard/StaffDashboard.jsx';

const DashboardPage = () => {
  const { user, logout, authorizedRequest } = useAuth();
  const [feedback, setFeedback] = useState('');

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('การลบบัญชีจะทำให้คุณไม่สามารถเข้าระบบได้อีก ต้องการดำเนินการต่อหรือไม่?')) {
      return;
    }
    try {
      await authorizedRequest(
        {
          url: '/account/me',
          method: 'delete',
        },
        { requireCsrf: true }
      );
      setFeedback('บัญชีถูกลบเรียบร้อยแล้ว');
      await logout();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'ไม่สามารถลบบัญชีได้');
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'staff':
      default:
        return <StaffDashboard />;
    }
  };

  return (
    <main>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>แดชบอร์ดสำหรับ {user.username}</h1>
          <RoleBadge role={user.role} />
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms">ข้อตกลงการใช้งาน</Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={handleDeleteAccount} style={{ background: '#e53935' }}>
            ลบบัญชี
          </button>
          <button type="button" onClick={logout}>
            ออกจากระบบ
          </button>
        </div>
      </header>
      {feedback && <div className="badge" style={{ marginTop: '1rem' }}>{feedback}</div>}
      {renderDashboard()}
    </main>
  );
};

export default DashboardPage;
