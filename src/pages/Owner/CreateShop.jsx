import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Calendar, Clock } from "lucide-react";

export default function CreateShop() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shop_name: "",
    localisation: "",
    number: "",
    openingTime: "",
    closingTime: "",
    restStart: "",
    restEnd: "",
    day_off: "",
    profilePicture: "",
    coverImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setForm({ ...form, [field]: imgUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Shop:", form);
    navigate("/my-shop");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6 pt-10">
        <h1 className="text-3xl font-bold text-center mb-4">Create Your Shop</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-700 space-y-4"
        >
          {/* Shop Name */}
          <div>
            <label className="block mb-1 font-medium">Shop Name</label>
            <input
              type="text"
              name="shop_name"
              value={form.shop_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              name="number"
              value={form.number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block mb-2 font-medium flex items-center gap-2">
              <Clock size={16} /> Working Hours
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                name="openingTime"
                value={form.openingTime}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
                placeholder="Opening"
              />
              <input
                type="time"
                name="closingTime"
                value={form.closingTime}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
                placeholder="Closing"
              />
              <input
                type="time"
                name="restStart"
                value={form.restStart}
                onChange={handleChange}
                className="px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
                placeholder="Rest Start"
              />
              <input
                type="time"
                name="restEnd"
                value={form.restEnd}
                onChange={handleChange}
                className="px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
                placeholder="Rest End"
              />
            </div>
          </div>

          {/* Day Off */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <Calendar size={16} /> Day Off
            </label>
            <select
              name="day_off"
              value={form.day_off}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            >
              <option value="">Choose a day</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <ImagePlus size={16} /> Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "profilePicture")}
              className="w-full bg-zinc-100 dark:bg-zinc-700 border rounded-xl p-2"
            />
            {form.profilePicture && (
              <img
                src={form.profilePicture}
                alt="Profile Preview"
                className="w-24 h-24 rounded-xl mt-2 object-cover"
              />
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <ImagePlus size={16} /> Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "coverImage")}
              className="w-full bg-zinc-100 dark:bg-zinc-700 border rounded-xl p-2"
            />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover Preview"
                className="w-full max-h-48 object-cover rounded-xl mt-2"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition"
          >
            Create Shop
          </button>
        </form>
      </div>
    </div>
  );
}
