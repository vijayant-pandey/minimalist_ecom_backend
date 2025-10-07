// frontend/src/pages/AdminUsers.jsx
import { useState, useEffect } from "react";
import API from "../utils/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChangeRole = async (userId, role) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role });
      alert("User role updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin — Users</h1>
      {loading ? <p>Loading...</p> : null}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{u.name}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{u.email}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{u.role}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                <select value={u.role} onChange={(e) => handleChangeRole(u._id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
