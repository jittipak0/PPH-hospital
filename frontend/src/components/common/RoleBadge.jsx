const colors = {
  admin: '#d32f2f',
  doctor: '#1976d2',
  nurse: '#388e3c',
  staff: '#6a1b9a',
};

const RoleBadge = ({ role }) => (
  <span
    className="badge"
    style={{
      background: `${colors[role] || '#2196f3'}20`,
      color: colors[role] || '#0d47a1',
    }}
  >
    {role.toUpperCase()}
  </span>
);

export default RoleBadge;
