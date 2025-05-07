/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  SiAdobe,
  SiApple,
  SiFacebook,
  SiGoogle,
  SiLinkedin,
  SiShopify,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
} from "react-icons/si";
import { useAnimate } from "framer-motion";

interface LinkItem {
  icon: React.ElementType;
  href: string;
  label?: string;
}

interface ClipPathLinksProps {
  className?: string;
  style?: React.CSSProperties;
  links?: LinkItem[];
  gridLayout?: '2x2' | '3x3' | '4x4' | 'custom';
  customGrid?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  hoverColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  animationDuration?: number;
}

export const ClipPathLinks: React.FC<ClipPathLinksProps> = ({ 
  className = "", 
  style = {},
  links = [
    { icon: SiGoogle, href: "#", label: "Google" },
    { icon: SiShopify, href: "#", label: "Shopify" },
    { icon: SiApple, href: "#", label: "Apple" },
    { icon: SiSoundcloud, href: "#", label: "Soundcloud" },
    { icon: SiAdobe, href: "#", label: "Adobe" },
    { icon: SiFacebook, href: "#", label: "Facebook" },
    { icon: SiTiktok, href: "#", label: "TikTok" },
    { icon: SiSpotify, href: "#", label: "Spotify" },
    { icon: SiLinkedin, href: "#", label: "LinkedIn" }
  ],
  gridLayout = '3x3',
  customGrid = '',
  iconSize = 'md',
  hoverColor = '#1a1a1a',
  backgroundColor = 'transparent',
  borderColor = '#1a1a1a',
  animationDuration = 0.3
}) => {
  const getGridClasses = () => {
    switch (gridLayout) {
      case '2x2':
        return 'grid-cols-2';
      case '3x3':
        return 'grid-cols-3';
      case '4x4':
        return 'grid-cols-4';
      case 'custom':
        return customGrid;
      default:
        return 'grid-cols-3';
    }
  };

  const getIconSize = () => {
    switch (iconSize) {
      case 'sm':
        return 'text-lg';
      case 'md':
        return 'text-2xl';
      case 'lg':
        return 'text-3xl';
      case 'xl':
        return 'text-4xl';
      default:
        return 'text-2xl';
    }
  };

  return (
    <div 
      className={`divide-y divide-${borderColor} border border-${borderColor} ${className}`} 
      style={{ 
        backgroundColor,
        ...style 
      }}
    >
      <div className={`grid ${getGridClasses()} divide-x divide-${borderColor}`}>
        {links.map((link, index) => (
          <LinkBox 
            key={index}
            Icon={link.icon}
            href={link.href}
            label={link.label}
            iconSize={getIconSize()}
            hoverColor={hoverColor}
            animationDuration={animationDuration}
          />
        ))}
      </div>
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

interface LinkBoxProps {
  Icon: React.ElementType;
  href: string;
  label?: string;
  iconSize: string;
  hoverColor: string;
  animationDuration: number;
}

const LinkBox: React.FC<LinkBoxProps> = ({ 
  Icon, 
  href, 
  label,
  iconSize,
  hoverColor,
  animationDuration
}) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const box = e.currentTarget.getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side as keyof typeof ENTRANCE_KEYFRAMES],
    }, { duration: animationDuration });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side as keyof typeof EXIT_KEYFRAMES],
    }, { duration: animationDuration });
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36"
    >
      <Icon className={iconSize} />
      {label && <span className="sr-only">{label}</span>}

      <div
        ref={scope}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
          backgroundColor: hoverColor,
        }}
        className="absolute inset-0 grid place-content-center text-white"
      >
        <Icon className={iconSize} />
      </div>
    </a>
  );
}; 