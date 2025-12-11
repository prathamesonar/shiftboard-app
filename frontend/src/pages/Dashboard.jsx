import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2, Info, X, Calendar, Clock, User, Briefcase, Plus } from "lucide-react";

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hourString, minute] = timeString.split(':');
  let hour = parseInt(hourString);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${minute} ${ampm}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ userId: "", date: "", startTime: "", endTime: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showInfo, setShowInfo] = useState(true);

  const token = user?.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const shiftRes = await axios.get("http://localhost:5000/api/shifts", config);
      setShifts(shiftRes.data);
      if (user.role === 'admin') {
        const empRes = await axios.get("http://localhost:5000/api/employees", config);
        setEmployees(empRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      await axios.post("http://localhost:5000/api/shifts", formData, config);
      setMessage({ text: "Shift assigned successfully!", type: "success" });
      setFormData({ userId: "", date: "", startTime: "", endTime: "" }); // Reset form
      fetchData();
      
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error creating shift", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this shift?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/shifts/${id}`, config);
      fetchData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {showInfo && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Info size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Employee Shift Board</h3>
                <p className="text-blue-100 text-sm max-w-3xl leading-relaxed">
                   Manage your team schedules efficiently. Validates overlapping shifts and ensures minimum 4-hour durations.
                   Regular users view their own schedule, while Admins manage the entire workforce.
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)} 
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-indigo-600" />
            Dashboard Overview
          </h2>
          
          <div className="flex gap-3 text-sm font-medium">
            <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
              Total Shifts: <span className="text-indigo-600 font-bold">{shifts.length}</span>
            </span>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Assign New Shift</h3>
              {message.text && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message.text}
                </span>
              )}
            </div>
            
            <form onSubmit={handleCreateShift} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Employee</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <select
                    className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Start Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="time"
                    className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">End Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="time"
                    className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95">
                  <Plus size={18} /> Assign
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                  <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  {user.role === 'admin' && <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {shifts.map((shift) => {
                    const start = new Date(`2000-01-01T${shift.startTime}`);
                    const end = new Date(`2000-01-01T${shift.endTime}`);
                    const diff = (end - start) / (1000 * 60 * 60);
                    
                    return (
                    <tr key={shift._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                            {shift.userId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{shift.userId?.name || "Unknown"}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                               <Briefcase size={12} /> {shift.userId?.employeeCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-gray-600 dark:text-gray-300">
                         {new Date(shift.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          diff >= 8 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {diff.toFixed(1)} Hours
                        </span>
                      </td>
                      {user.role === 'admin' && (
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => handleDelete(shift._id)} 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Shift"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                )})}
                {shifts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                           <Calendar size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                           <p className="text-lg font-medium">No shifts found</p>
                           <p className="text-sm">Get started by assigning a new shift above.</p>
                        </div>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;