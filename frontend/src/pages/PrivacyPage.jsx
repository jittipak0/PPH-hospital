import { Link } from 'react-router-dom';
import PrivacyPolicy from '../components/PrivacyPolicy.jsx';

const PrivacyPage = () => (
  <main>
    <Link to="/">← กลับสู่หน้าหลัก</Link>
    <PrivacyPolicy />
  </main>
);

export default PrivacyPage;
