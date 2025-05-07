/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps } from '@/components/Button';
import { NavbarProps } from '@/components/Navbar';
import { HeaderProps } from '@/components/Header';
import { NavbarDarkProps } from '@/components/NavbarDark';
import { BottomNavbarProps } from '@/components/BottomNavbar';
import { StarBorderProps } from '@/components/StarBorder';
import { WalletButtonProps } from '@/components/WalletButton';
import GridDistortionProps from "@/components/GridDistortion"

export interface Component {
  id: string;
  name: string;
  type: string;
  props: any;
  children?: Component[];
}

export interface DropZone {
  id: string;
  parentId: string | null;
  children: Component[];
}

export interface BuilderState {
  components: Component[];
  selectedComponent: Component | null;
  dropZones: DropZone[];
}

export interface CredentialsNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onShare?: (credentials: { type: string; value: string }) => void;
}

export type ComponentProps = 
  | ButtonProps 
  | NavbarProps 
  | HeaderProps 
  | NavbarDarkProps 
  | typeof GridDistortionProps 
  | BottomNavbarProps 
  | StarBorderProps 
  | WalletButtonProps
  | CredentialsNavbarProps
  | {
      // ArDacityNavBar props
      brand?: React.ReactNode;
      links?: {
        label: string;
        href: string;
        isActive?: boolean;
        onClick?: (e: React.MouseEvent) => void;
      }[];
      actions?: React.ReactNode;
      showWalletButton?: boolean;
      walletButtonProps?: any;
      variant?: 'default' | 'minimal' | 'transparent' | 'accent' | 'glass';
      position?: 'static' | 'sticky' | 'fixed';
      className?: string;
      mobileMenuClassName?: string;
      themeColor?: string;
    }
  | {
      // ArdacityHeaderOne props
      name?: string;
      title?: string;
      navLinks?: {
        label: string;
        href: string;
        isActive?: boolean;
        onClick?: (e: React.MouseEvent) => void;
      }[];
      images?: string[];
      className?: string;
      navbarProps?: any;
    }
  | {
      // ArdacityHeaderThree props
      imageSrc?: string;
      title?: string;
      grid?: number;
      mouse?: number;
      strength?: number;
      relaxation?: number;
      links?: Array<{
        name: string;
        href: string;
      }>;
      className?: string;
      navbarClassName?: string;
      distortionClassName?: string;
    }; 