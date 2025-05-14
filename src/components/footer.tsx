import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full p-8 border-t border-dashed mt-auto",
        className,
      )}
    >
      <div className="w-full m-auto text-sm text-center">
        Powered by{" "}
        <a href="https://runreal.dev" target="_blank" rel="noopener noreferrer">runreal.dev
        </a>
      </div>
    </div>
  );
}
