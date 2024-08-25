import React from 'react';
import SidebarTooltip from './SidebarTooltip';

export default function SidebarIcon({ icon, text = 'tooltip' }) {
  return (
    <div className="">
      {icon}
      <SidebarTooltip>{text}</SidebarTooltip>
    </div>
  );
}
