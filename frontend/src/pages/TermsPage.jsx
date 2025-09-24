import { Link } from 'react-router-dom';
import TermsOfUse from '../components/TermsOfUse.jsx';

const TermsPage = () => (
  <main>
    <Link to="/">← กลับสู่หน้าหลัก</Link>
    <TermsOfUse />
  </main>
);

export default TermsPage;
