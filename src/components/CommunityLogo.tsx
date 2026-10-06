import React from 'react';

interface CommunityLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'horizontal' | 'icon-only' | 'stacked';
}

export const CommunityLogo: React.FC<CommunityLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'horizontal',
}) => {
  // Generated logo image path from Gemini Imagen
  const logoSrc = '/src/assets/images/community_app_logo_1790781879601.jpg';

  const sizeClasses = {
    sm: { img: 'w-8 h-8', title: 'text-lg', tag: 'text-[9px]' },
    md: { img: 'w-10 h-10', title: 'text-xl', tag: 'text-[10px]' },
    lg: { img: 'w-14 h-14', title: 'text-2xl', tag: 'text-xs' },
    xl: { img: 'w-24 h-24', title: 'text-3xl', tag: 'text-sm' },
  }[size];

  if (variant === 'icon-only') {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-white shadow-2xs border border-[#DFEBDE] ${sizeClasses.img} ${className}`}>
        <img
          src={logoSrc}
          alt="Community Buying Pool Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-0.5"
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className={`relative rounded-2xl overflow-hidden bg-white shadow-xs border border-[#DFEBDE] mb-2 ${sizeClasses.img}`}>
          <img
            src={logoSrc}
            alt="Community Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-1"
          />
        </div>
        <span className={`font-black tracking-tight text-[#164E2A] leading-none ${sizeClasses.title}`}>
          COMMUNITY
        </span>
        {showTagline && (
          <span className={`font-semibold text-[#439A52] tracking-wide mt-1 ${sizeClasses.tag}`}>
            Buy Together. Save Together.
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal layout
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Emblem Icon */}
      <div className={`relative rounded-xl overflow-hidden bg-white shadow-2xs border border-[#DFEBDE] shrink-0 ${sizeClasses.img}`}>
        <img
          src={logoSrc}
          alt="Community Emblem"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Text */}
      <div className="leading-tight flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-[#164E2A] ${sizeClasses.title}`}>
            COMMUNITY
          </span>
          <span className="text-[9px] font-black uppercase text-[#164E2A] bg-[#E8F4E9] px-1.5 py-0.2 rounded-md border border-[#CEE2D1] tracking-wider">
            Pool
          </span>
        </div>
        {showTagline && (
          <p className={`font-bold text-[#439A52] tracking-wide flex items-center gap-1 ${sizeClasses.tag}`}>
            <span>Buy Together. Save Together.</span>
          </p>
        )}
      </div>
    </div>
  );
};
