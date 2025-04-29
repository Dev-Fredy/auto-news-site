"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const categories = ["Politics", "Sports", "Technology", "Business", "Entertainment"];
const languages = ["English", "Spanish", "French", "German"];

export default function PreferencesModal() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");

  const handleSave = async () => {
    await fetch("/api/user/preferences", {
      method: "POST",
      body: JSON.stringify({ categories: selectedCategories, language }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set Preferences</Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-800">
        <h2 className="text-lg font-semibold">Select Categories</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, category]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    );
                  }
                }}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
        <h2 className="text-lg font-semibold mt-4">Select Language</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}