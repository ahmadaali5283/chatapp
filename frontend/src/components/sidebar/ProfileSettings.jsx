import { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import Avatar from "../shared/Avatar";
import toast from "react-hot-toast";

export default function ProfileSettings({ onBack }) {
  const currentUser = useChatStore((s) => s.currentUser);
  const updateProfile = useChatStore((s) => s.updateProfile);
  const isUpdatingProfile = useChatStore((s) => s.isUpdatingProfile);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
        setSelectedImage(null);
      }
    };
  };

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-[108px] items-end bg-indigo-600 px-4 pb-4 text-white dark:border-slate-800 dark:bg-slate-800">
        <button onClick={onBack} className="mr-5 flex items-center justify-center transition hover:opacity-80">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="group relative">
            <Avatar 
              name={currentUser?.fullName} 
              src={selectedImage || currentUser?.profilePic} 
              size="xl" 
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera className="mb-2 h-8 w-8 text-white" />
              <span className="px-2 text-center text-xs font-medium text-white">
                {isUpdatingProfile ? "UPDATING..." : "CHANGE PROFILE PHOTO"}
              </span>
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </div>
        </div>

        <div className="mb-2 bg-white px-7 py-4 shadow-sm dark:bg-slate-800">
          <p className="mb-1 text-sm font-medium text-indigo-500 dark:text-indigo-400">Your name</p>
          <div className="text-slate-900 dark:text-white">
            {currentUser?.fullName}
          </div>
        </div>
        
        <div className="bg-white px-7 py-4 shadow-sm dark:bg-slate-800">
          <p className="mb-1 text-sm font-medium text-indigo-500 dark:text-indigo-400">Email address</p>
          <div className="text-slate-900 dark:text-white">
            {currentUser?.email}
          </div>
        </div>
      </div>
    </aside>
  );
}
