import { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Building, Camera, Save, Scissors, Clock, MapPin, X } from "lucide-react";
import OwnerBottomNav from "../../components/ShopOwnerBottomNav";

export default function ShopSettings() {
  const [shopName, setShopName] = useState("Hajemli Studio");
  const [shopAddress, setShopAddress] = useState("123 Main Street");
  const [shopCode, setShopCode] = useState("HAJEM123");
  const [isOpen, setIsOpen] = useState(true);
  const [workingHours, setWorkingHours] = useState({
    open: "09:00",
    close: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
  });
  const [daysOff, setDaysOff] = useState(["Sunday"]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const imageInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleToggleDay = (day) => {
    setDaysOff((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...previews]);
  };

  return (
    <div className="p-4 pb-24 pt-16 space-y-6 dark:text-white min-h-screen bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
        <Building className="w-6 h-6" /> Shop Settings
      </h1>
      <OwnerBottomNav />

      {/* Basic Info */}
      <div className="space-y-4 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
        <InputField
          icon={<Building className="w-4 h-4" />}
          label="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
        <InputField
          icon={<MapPin className="w-4 h-4" />}
          label="Address"
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
        />
        <InputField
          icon={<Camera className="w-4 h-4" />}
          label="Shop Code"
          value={shopCode}
          onChange={(e) => setShopCode(e.target.value)}
        />
      </div>

      {/* Shop Status */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">
            Shop is {isOpen ? "Open" : "Closed"}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            isOpen ? "bg-green-500 text-white" : "bg-zinc-500 text-white"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </button>
      </div>

      {/* Working Hours */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm space-y-4">
        <h2 className="text-sm font-medium mb-1">Working Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <TimeField
            label="Open Time"
            value={workingHours.open}
            onChange={(e) => setWorkingHours({ ...workingHours, open: e.target.value })}
          />
          <TimeField
            label="Close Time"
            value={workingHours.close}
            onChange={(e) => setWorkingHours({ ...workingHours, close: e.target.value })}
          />
          <TimeField
            label="Break Start"
            value={workingHours.breakStart}
            onChange={(e) =>
              setWorkingHours({ ...workingHours, breakStart: e.target.value })
            }
          />
          <TimeField
            label="Break End"
            value={workingHours.breakEnd}
            onChange={(e) =>
              setWorkingHours({ ...workingHours, breakEnd: e.target.value })
            }
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
                daysOff.includes(day)
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
          onClick={() => setImageModalOpen(true)}
          className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl flex items-center justify-center gap-2 font-medium"
        >
          <Camera className="w-4 h-4" />
          Upload Shop Images
        </button>

        <button className="bg-green-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium">
          <Save className="w-4 h-4" />
          Save Changes
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

function InputField({ label, value, onChange, icon }) {
  return (
    <div className="flex items-center gap-2 border rounded-md p-2 dark:border-zinc-700">
      {icon}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={label}
        className="bg-transparent outline-none flex-1 text-sm dark:text-white"
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
