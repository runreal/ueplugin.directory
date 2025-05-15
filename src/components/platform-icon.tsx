import { cn } from "@/lib/utils";
import { faWindows, faApple, faLinux, faAndroid } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export function PlatformIcon({ platform, className }: { platform: string; className?: string; }) {
    const platforms = {
        Win64: () => <FontAwesomeIcon icon={faWindows} className={cn("h-[24px] w-[24px]", className)} />,
        Mac: () => <FontAwesomeIcon icon={faApple} className={cn("h-[24px] w-[24px]", className)} />,
        Linux: () => <FontAwesomeIcon icon={faLinux} className={cn("h-[24px] w-[24px]", className)} />,
        IOS: () => <FontAwesomeIcon icon={faApple} className={cn("h-[24px] w-[24px]", className)} />,
        Android: () => <FontAwesomeIcon icon={faAndroid} className={cn("h-[24px] w-[24px]", className)} />,
    };

    const icon = platforms[platform as keyof typeof platforms];

    if (icon) {
        return icon();
    }

    return null;
}
