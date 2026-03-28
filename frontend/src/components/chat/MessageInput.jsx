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
    <div className="border-t border-slate-200 bg-slate-100 p-3 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
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
          className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-200"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="rounded-full bg-indigo-500 p-2 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
