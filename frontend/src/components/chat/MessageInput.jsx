import { useState } from "react";
import { Send, Smile } from "lucide-react";

export default function MessageInput({ onSend, disabled, onTyping }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    onTyping(false);
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-3">
      <div className="flex items-end gap-2 border border-slate-700 bg-slate-950 px-3 py-2">
        <button type="button" className="pb-1 text-slate-500 hover:text-slate-300">
          <Smile className="h-4 w-4" />
        </button>
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
          className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="bg-indigo-600 p-2 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
