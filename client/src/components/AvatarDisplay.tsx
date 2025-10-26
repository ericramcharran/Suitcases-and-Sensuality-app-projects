import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { isIconAvatar, getIconIdFromUrl, AVATAR_ICONS } from "@/data/avatarIcons";

interface AvatarDisplayProps {
  avatarUrl: string | null | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
  "data-testid"?: string;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const iconSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

/**
 * Reusable avatar display component that handles icon avatars and custom uploads
 * 
 * @param avatarUrl - The avatar URL (can be "icon:heart" format or object storage URL)
 * @param size - Size of the avatar (xs, sm, md, lg, xl)
 * @param fallbackIcon - Custom fallback icon to show when no avatar is set
 * @param className - Additional CSS classes
 * @param data-testid - Test ID for testing
 */
export function AvatarDisplay({
  avatarUrl,
  size = "md",
  fallbackIcon: FallbackIcon = User,
  className = "",
  "data-testid": testId,
}: AvatarDisplayProps) {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeClasses[size];

  // No avatar set - show fallback
  if (!avatarUrl) {
    return (
      <Avatar className={`${sizeClass} ${className}`} data-testid={testId || "avatar-fallback"}>
        <AvatarFallback className="bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
          <FallbackIcon className={iconSize} />
        </AvatarFallback>
      </Avatar>
    );
  }

  // Icon avatar (icon:heart format)
  if (isIconAvatar(avatarUrl)) {
    const iconId = getIconIdFromUrl(avatarUrl);
    const avatarIcon = AVATAR_ICONS.find(icon => icon.id === iconId);
    
    if (avatarIcon) {
      const IconComponent = avatarIcon.icon;
      return (
        <Avatar className={`${sizeClass} ${className}`} data-testid={testId || `avatar-icon-${iconId}`}>
          <AvatarFallback className="bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
            <IconComponent className={iconSize} />
          </AvatarFallback>
        </Avatar>
      );
    }
    
    // Icon not found - show fallback
    return (
      <Avatar className={`${sizeClass} ${className}`} data-testid={testId || "avatar-fallback"}>
        <AvatarFallback className="bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
          <FallbackIcon className={iconSize} />
        </AvatarFallback>
      </Avatar>
    );
  }

  // Custom uploaded avatar
  return (
    <Avatar className={`${sizeClass} ${className}`} data-testid={testId || "avatar-custom"}>
      <img src={avatarUrl} alt="Avatar" className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-nexus-purple/20 to-nexus-red/20">
        <FallbackIcon className={iconSize} />
      </AvatarFallback>
    </Avatar>
  );
}
