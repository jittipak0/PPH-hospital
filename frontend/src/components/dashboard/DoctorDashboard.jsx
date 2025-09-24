import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const DoctorDashboard = () => {
  const { authorizedRequest } = useAuth();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    authorizedRequest({ url: '/doctor/patients', method: 'get' })
      .then((response) => setPatients(response.data.patients))
      .catch(() => setPatients([]));
  }, [authorizedRequest]);

  return (
    <section className="card">
      <h2>ผู้ป่วยในความดูแล</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <strong>{patient.name}</strong> — {patient.diagnosis}
            <div style={{ fontSize: '0.85rem', color: '#607d8b' }}>อัปเดตล่าสุด: {patient.updatedAt}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DoctorDashboard;
