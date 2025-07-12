import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createShopWithImages } from "../../services/api";

export default function CreateShop() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    shop_name: "",
    localisation: "",
    number: "",
    type: "",
    area: "",
    openingTime: "",
    closingTime: "",
    day_off: "",
    profilePicture: "",
    coverImage: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setForm({ ...form, [field]: imgUrl });
      if (field === "profilePicture") setProfilePictureFile(file);
      if (field === "coverImage") setCoverImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      if (!user || !user.owner_id) throw new Error("Owner not logged in");
      // Prepare shop data
      const shopData = {
        shop_name: form.shop_name,
        owner_id: user.owner_id,
        localisation: form.localisation,
        number: form.number,
        rating: 0,
        work_hours: `${form.openingTime} - ${form.closingTime}`,
        day_off: form.day_off,
        barbers: [user.owner_id],
        area: form.area,
        type: form.type,
      };
      // Create shop with images
      await createShopWithImages(shopData, profilePictureFile, coverImageFile);
      setSuccess(true);
      setTimeout(() => {
        navigate("/owner/shop");
      }, 2000);
      // Optionally update shop with image URLs if needed (if backend doesn't do it automatically)
      // Success: redirect
    } catch (err) {
      setError(err.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6 pt-10">
        <h1 className="text-3xl font-bold text-center mb-4">Create Your Shop</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-700 space-y-4"
        >
          {error && <div className="text-red-500 text-center">{error}</div>}
          {loading && <div className="text-center text-zinc-500">Creating shop...</div>}
          {success && (
            <div className="flex flex-col items-center justify-center gap-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl p-4 my-2 animate-fade-in">
              <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200 text-lg font-semibold">Shop created successfully!</span>
              <span className="text-green-700 dark:text-green-300 text-sm">Redirecting to your shop...</span>
            </div>
          )}
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

          {/* Type */}
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            >
              <option value="">Choose type</option>
              <option value="Barber">Barber</option>
              <option value="Hair salon">Hair salon</option>
              <option value="Nails">Nails</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block mb-1 font-medium">Area</label>
            <select
              name="area"
              value={form.area}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600"
            >
              <option value="">Choose area</option>
              <option value="Tunis">Tunis</option>
              <option value="Sousse">Sousse</option>
              <option value="Sfax">Sfax</option>
              <option value="Monastir">Monastir</option>
            </select>
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
            <div className="flex items-center gap-4 w-full">
              <label
                htmlFor="profilePictureInput"
                className="flex items-center justify-center w-full px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition border border-zinc-300 dark:border-zinc-600 gap-2"
              >
                <ImagePlus size={18} className="mr-2" />
                Choose File
              </label>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "profilePicture")}
                className="hidden"
              />
              {form.profilePicture && (
                <span className="text-sm text-zinc-500 dark:text-zinc-300">Selected</span>
              )}
            </div>
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
            <div className="flex items-center gap-4 w-full">
              <label
                htmlFor="coverImageInput"
                className="flex items-center justify-center w-full px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition border border-zinc-300 dark:border-zinc-600 gap-2"
              >
                <ImagePlus size={18} className="mr-2" />
                Choose File
              </label>
              <input
                id="coverImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "coverImage")}
                className="hidden"
              />
              {form.coverImage && (
                <span className="text-sm text-zinc-500 dark:text-zinc-300">Selected</span>
              )}
            </div>
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
