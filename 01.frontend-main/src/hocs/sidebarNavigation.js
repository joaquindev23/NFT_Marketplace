import {
  //   ArchiveBoxIcon,
  //   Bars3Icon,
  //   BellIcon,
  FlagIcon,
  InboxIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  VideoCameraIcon,
  //   NoSymbolIcon,
  //   PencilSquareIcon,
  //   UserCircleIcon,
  //   XMarkIcon,
} from '@heroicons/react/24/outline';

export const sidebarNavigation = [
  { name: 'Inbox', href: '/inbox', icon: InboxIcon, current: true },
  { name: 'Video Rooms', href: '/inbox', icon: VideoCameraIcon, current: false },
  { name: 'Chat Rooms', href: '/inbox', icon: RectangleGroupIcon, current: false },
  { name: 'Contacts', href: '/inbox', icon: UserGroupIcon, current: false },
  { name: 'Privacy', href: '/inbox', icon: FlagIcon, current: false },
  { name: 'Settings', href: '/inbox', icon: Cog6ToothIcon, current: false },
];
