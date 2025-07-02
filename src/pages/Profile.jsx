import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut, UploadCloud } from "lucide-react";
import BottomNav from "../components/BottomNav";
import FloatingBookButton from "../components/FloatingBookButton";

export default function Profile() {
  const navigate = useNavigate();

  const mockClient = {
    first_name: "Amine",
    last_name: "BZ",
    phone: "+21612345678",
    birthdate: "1999-06-15",
    mail: "amine@example.com",
    profilePicture: "https://i.pravatar.cc/150?u=amine",
    shop_id: "TUNX45",
  };

  const [client, setClient] = useState(mockClient);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setClient({ ...client, profilePicture: imgURL });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("client");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300 px-4 pt-8 pb-32">
      <BottomNav />
      <FloatingBookButton />

      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-md space-y-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28">
            <img
              src={client.profilePicture}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-zinc-700 shadow"
            />
            {editMode && (
              <label className="absolute bottom-1 right-1 bg-black/70 dark:bg-white/20 p-2 rounded-full cursor-pointer hover:scale-105 transition">
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
          <h2 className="mt-4 text-xl font-bold">
            {client.first_name} {client.last_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{client.mail}</p>
        </div>

        {/* Grid Fields */}
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
            value={client.birthdate}
            onChange={handleChange}
            editable={editMode}
          />
          <InputField label="Email" name="mail" value={client.mail} editable={false} />
        </div>

        {/* Buttons row */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition"
          >
            <Pencil size={16} />
            {editMode ? "Save" : "Edit Profile"}
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
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      ) : (
        <p className="text-base text-zinc-800 dark:text-zinc-200">{value || "—"}</p>
      )}
    </div>
  );
}
