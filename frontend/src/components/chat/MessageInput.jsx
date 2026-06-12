import { useState, useRef } from "react";
import { Send, Smile, Image, X } from "lucide-react";

export default function MessageInput({ onSend, disabled, onTyping }) {
  const [value, setValue] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const submit = () => {
    const trimmed = value.trim();
    if ((!trimmed && !imagePreview) || disabled) return;
    onSend(trimmed, imagePreview);
    setValue("");
    setImagePreview(null);
    onTyping(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImagePreview(reader.result);
    e.target.value = "";
  };

  return (
    <div className="border-t border-slate-200 bg-slate-100 p-3 transition-colors dark:border-slate-800 dark:bg-slate-900">
      {imagePreview && (
        <div className="relative mb-2 inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 w-20 rounded-lg border border-slate-300 object-cover dark:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
        <button type="button" className="pb-1 text-slate-500 hover:text-slate-300">
          <Smile className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="pb-1 text-slate-500 hover:text-indigo-500 transition-colors"
          title="Attach image"
        >
          <Image className="h-4 w-4" />
        </button>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <textarea
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onTyping(Boolean(e.target.value.trim()));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type a message"
          className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-200"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || (!value.trim() && !imagePreview)}
          className="rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
