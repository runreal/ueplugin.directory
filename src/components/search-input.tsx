"use client";

import {  useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        event.preventDefault();
        // Trigger the search input focus here
        const searchInput = inputRef.current;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      if (event.key === "Escape") {
        const searchInput = inputRef.current;
        if (searchInput) {
          searchInput.blur();
        }
      }
      if (event.key === "Enter" && focused) {
        window.location.href = `/?search=${value}`;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, focused]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <div className="inline-flex items-center w-[400px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input hover:text-accent-foreground py-2 relative h-10 justify-start bg-muted/50 text-sm font-normal text-muted-foreground shadow-none p-0 overflow-hidden">
      <Input
        ref={inputRef}
        onChange={onSearch}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={value}
        type="text"
        placeholder="Search plugins..."
        className="h-10 w-full border-0 px-4 text-sm font-normal text-muted-foreground shadow-none outline-none transition-all focus-visible:outline-none focus-visible:ring-0 hover:!bg-accent focus:!bg-accent !rounded-0 focus-visible:border-0"
      />
      <kbd className="pointer-events-none absolute right-3 top-[10px] hidden h-5 select-none items-center gap-1 border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
      {focused ? (
        <div className="absolute right-12 top-3 flex items-center gap-1 text-xs text-muted-foreground/50">
          Enter to search
        </div>
      ) : null}
    </div>
  );
};
export { SearchInput };
