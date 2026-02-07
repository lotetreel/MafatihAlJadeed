"""
Ramadan Calendar Event Editor
A Tkinter GUI for adding calendar events directly to content.ts
"""

import tkinter as tk
from tkinter import ttk, messagebox
import re
import os

# Path to the content.ts file
CONTENT_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "app", "src", "data", "content.ts"
)

EVENT_TYPES = [
    ("🌙 Occasion", "occasion"),
    ("⭐ Night of Power", "night-of-power"),
    ("💧 Martyrdom", "martyrdom"),
    ("👑 Birth", "birth"),
]

LEVELS = [
    ("✦ Essential", 1, "#10b981"),
    ("★ Striver", 2, "#3b82f6"),
    ("♔ Wayfarer", 3, "#f59e0b"),
]


class CalendarEventEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("Ramadan Calendar Event Editor")
        self.root.geometry("600x700")
        self.root.configure(bg="#1a1a1a")
        
        # Variables
        self.date_var = tk.IntVar(value=1)
        self.title_var = tk.StringVar()
        self.arabic_var = tk.StringVar()
        self.desc_var = tk.StringVar()
        self.type_var = tk.StringVar(value="occasion")
        self.level_var = tk.IntVar(value=1)
        
        self.create_widgets()
        
    def create_widgets(self):
        # Style
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TFrame", background="#1a1a1a")
        style.configure("TLabel", background="#1a1a1a", foreground="#e5e5e5", font=("Segoe UI", 10))
        style.configure("TEntry", fieldbackground="#2a2a2a", foreground="#e5e5e5")
        style.configure("TButton", background="#4ade80", foreground="#000000", font=("Segoe UI", 10, "bold"))
        style.configure("TRadiobutton", background="#1a1a1a", foreground="#e5e5e5")
        
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = tk.Label(main_frame, text="📅 Ramadan Calendar Event Editor", 
                              font=("Segoe UI", 16, "bold"), bg="#1a1a1a", fg="#4ade80")
        title_label.pack(pady=(0, 5))
        
        subtitle = tk.Label(main_frame, text="Add events directly to content.ts",
                           font=("Segoe UI", 10), bg="#1a1a1a", fg="#888")
        subtitle.pack(pady=(0, 20))
        
        # Form Frame
        form_frame = tk.Frame(main_frame, bg="#2a2a2a", padx=20, pady=20)
        form_frame.pack(fill=tk.X, pady=10)
        
        # Day
        row = 0
        tk.Label(form_frame, text="Day of Ramadan (1-30):", bg="#2a2a2a", fg="#888", 
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        day_frame = tk.Frame(form_frame, bg="#2a2a2a")
        day_frame.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        
        self.day_spin = tk.Spinbox(day_frame, from_=1, to=30, textvariable=self.date_var,
                                   width=10, bg="#0f0f0f", fg="#e5e5e5", 
                                   font=("Segoe UI", 12), insertbackground="#e5e5e5")
        self.day_spin.pack(side=tk.LEFT)
        row += 1
        
        # Title
        tk.Label(form_frame, text="Title (English):", bg="#2a2a2a", fg="#888",
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        self.title_entry = tk.Entry(form_frame, textvariable=self.title_var, 
                                    bg="#0f0f0f", fg="#e5e5e5", font=("Segoe UI", 11),
                                    insertbackground="#e5e5e5")
        self.title_entry.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        row += 1
        
        # Arabic Title
        tk.Label(form_frame, text="Arabic Title (Optional):", bg="#2a2a2a", fg="#888",
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        self.arabic_entry = tk.Entry(form_frame, textvariable=self.arabic_var,
                                     bg="#0f0f0f", fg="#e5e5e5", font=("Segoe UI", 11),
                                     insertbackground="#e5e5e5", justify="right")
        self.arabic_entry.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        row += 1
        
        # Description
        tk.Label(form_frame, text="Description:", bg="#2a2a2a", fg="#888",
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        self.desc_text = tk.Text(form_frame, height=4, bg="#0f0f0f", fg="#e5e5e5",
                                 font=("Segoe UI", 10), insertbackground="#e5e5e5", wrap=tk.WORD)
        self.desc_text.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        row += 1
        
        form_frame.columnconfigure(0, weight=1)
        
        # Event Type
        tk.Label(form_frame, text="Event Type:", bg="#2a2a2a", fg="#888",
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        type_frame = tk.Frame(form_frame, bg="#2a2a2a")
        type_frame.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        
        for i, (name, value) in enumerate(EVENT_TYPES):
            rb = tk.Radiobutton(type_frame, text=name, variable=self.type_var, value=value,
                               bg="#2a2a2a", fg="#e5e5e5", selectcolor="#4ade80",
                               activebackground="#2a2a2a", activeforeground="#e5e5e5",
                               font=("Segoe UI", 9))
            rb.pack(side=tk.LEFT, padx=(0, 15))
        row += 1
        
        # Level
        tk.Label(form_frame, text="Level:", bg="#2a2a2a", fg="#888",
                font=("Segoe UI", 9)).grid(row=row, column=0, sticky="w", pady=(0, 5))
        row += 1
        
        level_frame = tk.Frame(form_frame, bg="#2a2a2a")
        level_frame.grid(row=row, column=0, sticky="ew", pady=(0, 15))
        
        for name, value, color in LEVELS:
            rb = tk.Radiobutton(level_frame, text=name, variable=self.level_var, value=value,
                               bg="#2a2a2a", fg=color, selectcolor=color,
                               activebackground="#2a2a2a", activeforeground=color,
                               font=("Segoe UI", 9, "bold"))
            rb.pack(side=tk.LEFT, padx=(0, 15))
        
        # Buttons
        btn_frame = tk.Frame(main_frame, bg="#1a1a1a")
        btn_frame.pack(fill=tk.X, pady=20)
        
        add_btn = tk.Button(btn_frame, text="➕ Add Event to content.ts", 
                           command=self.add_event, bg="#4ade80", fg="#000",
                           font=("Segoe UI", 11, "bold"), padx=20, pady=10,
                           activebackground="#22c55e", cursor="hand2")
        add_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(0, 5))
        
        clear_btn = tk.Button(btn_frame, text="🗑️ Clear Form", 
                             command=self.clear_form, bg="#2a2a2a", fg="#e5e5e5",
                             font=("Segoe UI", 11), padx=20, pady=10,
                             activebackground="#333", cursor="hand2")
        clear_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(5, 0))
        
        # Status
        self.status_label = tk.Label(main_frame, text="", bg="#1a1a1a", fg="#4ade80",
                                    font=("Segoe UI", 10))
        self.status_label.pack(pady=10)
        
        # File path info
        path_label = tk.Label(main_frame, text=f"Target: {CONTENT_FILE}", 
                             bg="#1a1a1a", fg="#666", font=("Segoe UI", 8), wraplength=550)
        path_label.pack(pady=10)
        
    def clear_form(self):
        self.date_var.set(1)
        self.title_var.set("")
        self.arabic_var.set("")
        self.desc_text.delete("1.0", tk.END)
        self.type_var.set("occasion")
        self.level_var.set(1)
        
    def add_event(self):
        # Get values
        date = self.date_var.get()
        title = self.title_var.get().strip()
        arabic = self.arabic_var.get().strip()
        description = self.desc_text.get("1.0", tk.END).strip()
        event_type = self.type_var.get()
        level = self.level_var.get()
        
        # Validate
        if not title:
            messagebox.showerror("Error", "Title is required!")
            return
        if not description:
            messagebox.showerror("Error", "Description is required!")
            return
        if date < 1 or date > 30:
            messagebox.showerror("Error", "Day must be between 1 and 30!")
            return
            
        # Check if file exists
        if not os.path.exists(CONTENT_FILE):
            messagebox.showerror("Error", f"Could not find content.ts at:\n{CONTENT_FILE}")
            return
            
        # Read file
        with open(CONTENT_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find the calendarEvents array
        pattern = r'(export const calendarEvents: CalendarEvent\[\] = \[)'
        match = re.search(pattern, content)
        
        if not match:
            messagebox.showerror("Error", "Could not find calendarEvents array in content.ts")
            return
            
        # Build new event
        new_event = f"""
  {{
    date: {date},
    title: '{title.replace("'", "\\'")}',"""
        
        if arabic:
            new_event += f"""
    arabicTitle: '{arabic}',"""
            
        new_event += f"""
    description: '{description.replace("'", "\\'")}',
    type: '{event_type}',
    level: {level}
  }},"""
        
        # Insert after the opening bracket
        insert_pos = match.end()
        new_content = content[:insert_pos] + new_event + content[insert_pos:]
        
        # Write back
        with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        self.status_label.config(text=f"✓ Added '{title}' to content.ts!")
        self.root.after(3000, lambda: self.status_label.config(text=""))
        
        # Clear form
        self.clear_form()
        
        messagebox.showinfo("Success", f"Event '{title}' added to content.ts!\n\nThe app will auto-reload if dev server is running.")


def main():
    root = tk.Tk()
    app = CalendarEventEditor(root)
    root.mainloop()


if __name__ == "__main__":
    main()
