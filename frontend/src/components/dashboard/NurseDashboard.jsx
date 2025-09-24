import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const NurseDashboard = () => {
  const { authorizedRequest } = useAuth();
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    authorizedRequest({ url: '/nurse/shifts', method: 'get' })
      .then((response) => setShifts(response.data.shifts))
      .catch(() => setShifts([]));
  }, [authorizedRequest]);

  return (
    <section className="card">
      <h2>ตารางเวรของฉัน</h2>
      <ul>
        {shifts.map((shift) => (
          <li key={shift.id}>
            <strong>{shift.shiftDate}</strong> — {shift.shiftTime}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NurseDashboard;
