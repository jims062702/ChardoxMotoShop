import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav>
        <ul className="space-y-4 list-none">
          <li>
            <Link 
              to="/admin/sales-records" 
              className="text-black hover:text-gray-700 hover:bg-gray-100 p-2 rounded transition-all"
              style={{ textDecoration: 'none' }}
            >
              Sales Records
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
