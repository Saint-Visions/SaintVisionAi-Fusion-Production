
'use client';
import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Mode = 'companion' | 'boss' | 'thinking' | 'confirmation';
type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';
type Emotion = 'neutral' | 'frustrated' | 'success' | 'idle';

interface SaintSalAvatarProps {
  mode: Mode;
  plan: Plan;
  emotion: Emotion;
}

const avatarMap = {
  companion: '/avatars/saintsal-companion.png',
  boss: '/avatars/saintsal-boss.png',
  thinking: '/avatars/saintsal-thinking.gif',
  confirmation: '/avatars/saintsal-confirmed.png',
};

const statusIcon = {
  thinking: '🧠',
  boss: '🛡️',
  confirmation: '📑',
  default: '',
};

export default function SaintSalAvatar({ mode, plan, emotion }: SaintSalAvatarProps) {
  const avatarSrc = avatarMap[mode] || avatarMap.companion;
  const icon = statusIcon[mode] || statusIcon.default;

  return (
    <div
      className={clsx(
        'relative w-16 h-16 rounded-full border-2 shadow-lg transition-all',
        plan === 'PRO' ? 'border-yellow-400' : 'border-gray-400',
        mode === 'boss' ? 'ring-2 ring-gold animate-pulse' : ''
      )}
    >
      <Image
        src={avatarSrc}
        alt="SaintSal Avatar"
        width={64}
        height={64}
        className="rounded-full object-cover"
      />
      {icon && (
        <span className="absolute bottom-0 right-0 text-xs bg-black text-white rounded-full p-1 shadow-md">
          {icon}
        </span>
      )}
    </div>
  );
}
