import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Building, Camera, Save, Scissors, Clock, MapPin, X } from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";
import { useAuth } from "../../context/AuthContext";
import { fetchShopByOwnerId, fetchShopById, updateShop, uploadShopProfilePicture, uploadShopCoverPicture } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ShopSettings() {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const imageInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.owner_id) return;
      setLoading(true);
      setError("");
      try {
        const ownerShop = await fetchShopByOwnerId(user.owner_id);
        if (!ownerShop.shop_id) {
          setShop(null);
          setLoading(false);
          return;
        }
        const shopDetails = await fetchShopById(ownerShop.shop_id);
        setShop(shopDetails);
      } catch (err) {
        setError("Failed to load shop data.");
        setShop(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleToggleDay = (day) => {
    if (!shop) return;
    setShop((prev) => ({
      ...prev,
      day_off: prev.day_off === day ? "" : day,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...previews]);
    // You can implement image upload logic here if needed
  };

  const handleSave = async () => {
    if (!shop?.shop_id) return;
    setSaving(true);
    setError("");
    try {
      await updateShop(shop.shop_id, shop);
      navigate("/owner/shop");
    } catch (err) {
      setError("Failed to save changes.");
    }
    setSaving(false);
  };

  // Handle profile image upload
  const handleProfileImageChange = async (e) => {
    if (!shop?.shop_id || !e.target.files?.[0]) return;
    setUploadingProfile(true);
    try {
      const res = await uploadShopProfilePicture(shop.shop_id, e.target.files[0]);
      setShop((prev) => ({ ...prev, profilePicture: res.imageUrl }));
    } catch (err) {
      setError("Failed to upload profile picture.");
    }
    setUploadingProfile(false);
  };

  // Handle cover image upload
  const handleCoverImageChange = async (e) => {
    if (!shop?.shop_id || !e.target.files?.[0]) return;
    setUploadingCover(true);
    try {
      const res = await uploadShopCoverPicture(shop.shop_id, e.target.files[0]);
      setShop((prev) => ({ ...prev, coverImage: res.imageUrl }));
    } catch (err) {
      setError("Failed to upload cover picture.");
    }
    setUploadingCover(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;
  if (!shop) return <div>No shop found.</div>;

  return (
    <div className="p-4 pb-24 pt-16 space-y-6 dark:text-white min-h-screen bg-white dark:bg-zinc-900">
      {/* Profile and Cover Images */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={shop.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700"
            />
            <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1 cursor-pointer hover:bg-zinc-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
                disabled={uploadingProfile}
              />
            </label>
          </div>
          {uploadingProfile && <span className="text-xs text-zinc-500">Uploading...</span>}
          <span className="text-xs">Profile Picture</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={shop.coverImage}
              alt="Cover"
              className="w-32 h-20 rounded-lg object-cover border-4 border-zinc-200 dark:border-zinc-700"
            />
            <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1 cursor-pointer hover:bg-zinc-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
                disabled={uploadingCover}
              />
            </label>
          </div>
          {uploadingCover && <span className="text-xs text-zinc-500">Uploading...</span>}
          <span className="text-xs">Cover Image</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
        <Building className="w-6 h-6" /> Shop Settings
      </h1>
      <OwnerBottomNav />

      {/* Basic Info */}
      <div className="space-y-4 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <InputField
          icon={<Building className="w-4 h-4" />}
          label="Shop Name"
          value={shop.shop_name || ""}
          onChange={(e) => setShop({ ...shop, shop_name: e.target.value })}
        />
        <InputField
          icon={<MapPin className="w-4 h-4" />}
          label="Address"
          value={shop.localisation || ""}
          onChange={(e) => setShop({ ...shop, localisation: e.target.value })}
        />
        <InputField
          icon={<Camera className="w-4 h-4" />}
          label="Shop Code"
          value={shop.shop_id || ""}
          onChange={() => {}}
          disabled
        />
      </div>

      {/* Shop Status */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">
            Shop is Open
          </span>
        </div>
        <button
          className={`px-4 py-1 rounded-full text-sm font-medium bg-green-500 text-white`}
          disabled
        >
          Open
        </button>
      </div>

      {/* Working Hours */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm space-y-4">
        <h2 className="text-sm font-medium mb-1">Working Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <TimeField
            label="Open Time"
            value={shop.work_hours?.split(" - ")[0] || ""}
            onChange={(e) => setShop({ ...shop, work_hours: `${e.target.value} - ${shop.work_hours?.split(" - ")[1] || ""}` })}
          />
          <TimeField
            label="Close Time"
            value={shop.work_hours?.split(" - ")[1] || ""}
            onChange={(e) => setShop({ ...shop, work_hours: `${shop.work_hours?.split(" - ")[0] || ""} - ${e.target.value}` })}
          />
        </div>
      </div>

      {/* Days Off */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <h2 className="text-sm font-medium mb-2">Days Off</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <button
              key={day}
              onClick={() => handleToggleDay(day)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                shop.day_off === day
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white border-zinc-300 dark:border-zinc-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href="/owner/team"
          className="bg-black text-white dark:bg-white dark:text-black p-3 rounded-xl flex items-center justify-center gap-2 font-medium"
        >
          <Scissors className="w-4 h-4" />
          Manage Team
        </a>

      

        <button
          onClick={handleSave}
          className="bg-green-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-60"
          disabled={saving}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Image Upload Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-zinc-800 dark:text-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upload Shop Images</h2>
              <button
                onClick={() => setImageModalOpen(false)}
                className="text-zinc-500 hover:text-red-500"
              >
                <X />
              </button>
            </div>

            <input
              type="file"
              multiple
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="w-full text-sm"
              accept="image/*"
            />

            <div className="grid grid-cols-3 gap-2 mt-2">
              {uploadedImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="preview"
                  className="rounded-lg h-20 object-cover"
                />
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function InputField({ label, value, onChange, icon, disabled }) {
  return (
    <div className="flex items-center gap-2 border rounded-md p-2 dark:border-zinc-700">
      {icon}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={label}
        className="bg-transparent outline-none flex-1 text-sm dark:text-white"
        disabled={disabled}
      />
    </div>
  );
}

function TimeField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="font-medium">{label}</label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="w-full rounded-md border px-3 py-1 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      />
    </div>
  );
}
