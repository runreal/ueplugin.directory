import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full p-8 border-t border-dashed mt-auto",
        className,
      )}
    >
      <div className="flex gap-4 justify-center  items-center w-full m-auto text-sm">
        Powered by
        <a href="http://runreal.dev" target="_blank" rel="noopener noreferrer">
          runreal.dev
        </a>
      </div>
    </div>
  );
}
