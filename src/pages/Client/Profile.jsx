import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut, UploadCloud } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import FloatingBookButton from "../../components/FloatingBookButton";
import { useAuth } from "../../context/AuthContext";
import { fetchClientById, updateClientDetails, uploadClientProfilePicture } from "../../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getClient() {
      if (user && user.client_id) {
        try {
          const data = await fetchClientById(user.client_id);
          setClient(data);
        } catch (err) {
          // handle error, optionally set error state
        }
      }
      setLoading(false);
    }
    getClient();
  }, [user]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user && user.client_id) {
      try {
        const res = await uploadClientProfilePicture(user.client_id, file);
        setClient((prev) => ({ ...prev, profilePicture: res.imageUrl }));
      } catch (err) {
        // handle error
      }
    }
  };

  const handleEditSave = async () => {
    if (editMode && user && user.client_id) {
      try {
        const updateData = {
          first_name: client.first_name,
          last_name: client.last_name,
          phone: client.phone,
          birthdate: client.birthdate,
        };
        await updateClientDetails(user.client_id, updateData);
        // Optionally refetch or just exit edit mode
        setEditMode(false);
      } catch (err) {
        // handle error
      }
    } else {
      setEditMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!client) {
    return <div className="min-h-screen flex items-center justify-center">No client data found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300 px-4 pt-8 pb-32">
      <BottomNav />
      <FloatingBookButton />

      <div className="max-w-2xl mx-auto p-6 rounded-3xl transition-all duration-300 space-y-10">
        {/* Avatar */}
        <div className="flex flex-col items-center group">
          <div className="relative w-28 h-28 transition-transform duration-300 group-hover:scale-105">
            <img
              src={client.profilePicture}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-zinc-700 shadow-xl transition-all"
            />
            {editMode && (
              <label className="absolute bottom-1 right-1 bg-black/70 dark:bg-white/20 p-2 rounded-full cursor-pointer hover:scale-110 transition">
                <UploadCloud size={16} className="text-white dark:text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold transition">
            {client.first_name} {client.last_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 transition">
            {client.mail}
          </p>
        </div>

        {/* Profile Info Section */}
        <div className="space-y-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              name="first_name"
              value={client.first_name}
              onChange={handleChange}
              editable={editMode}
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={client.last_name}
              onChange={handleChange}
              editable={editMode}
            />
            <InputField
              label="Phone"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              editable={editMode}
            />
            <InputField
              label="Birthdate"
              name="birthdate"
              type="date"
              value={formatDate(client.birthdate)}
              onChange={handleChange}
              editable={editMode}
            />
            <InputField label="Email" name="mail" value={client.mail} editable={false} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handleEditSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition"
          >
            <Pencil size={16} />
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-zinc-700 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '';
  // Handles both ISO and already formatted dates
  return dateString.split('T')[0];
}

function InputField({ label, name, value, onChange, editable, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">
        {label}
      </label>
      {editable ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
        />
      ) : (
        <p className="text-base text-zinc-800 dark:text-zinc-200">{name === 'birthdate' ? formatDate(value) : value || "—"}</p>
      )}
    </div>
  );
}
