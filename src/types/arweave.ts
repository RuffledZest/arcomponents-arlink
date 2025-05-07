/* eslint-disable @typescript-eslint/no-namespace */
// Add process.env type definition
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace NodeJS {
    
  }
}

export interface ArweaveComponentProps {
  // Common Arweave props
  walletAddress?: string;
  aoProcessId?: string;
  luaCode?: string;
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  onTransaction?: (tx: any) => void;
  onMessage?: (msg: any) => void;
  onInbox?: (inbox: any[]) => void;
  onError?: (error: Error) => void;
}

export interface ArweaveNFTProps extends ArweaveComponentProps {
  tokenId: string;
  owner: string;
  imageUrl: string;
  title: string;
  description: string;
  onTransfer?: (data: { to: string; tokenId: string }) => void;
  onMint?: (data: { title: string; description: string; imageUrl: string }) => void;
}

export interface ArweaveFormProps extends ArweaveComponentProps {
  title: string;
  description: string;
  onSubmit?: (data: any) => void;
  onSign?: (data: { message: string; signature: string }) => void;
}

export interface ArweaveNavbarProps extends ArweaveComponentProps {
  brand: string;
  links: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  showWalletButton?: boolean;
  variant?: 'default' | 'minimal' | 'transparent' | 'accent' | 'glass';
  position?: 'static' | 'sticky' | 'fixed';
  themeColor?: string;
}

export interface ArweaveHeaderProps extends ArweaveComponentProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: 'sm' | 'md' | 'lg';
  textColor?: 'light' | 'dark';
  ctaButton?: {
    text: string;
    href: string;
    type: 'default' | 'primary' | 'secondary' | 'outline' | 'star';
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
  };
}

export interface ArweaveGridProps {
  imageSrc: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
  aoProcessId?: string;
  luaCode?: string;
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  onTransaction?: (tx: any) => void;
  onMessage?: (message: any) => void;
  onInbox?: (inbox: any[]) => void;
  onError?: (error: any) => void;
  onGridUpdate?: (params: {
    grid: number;
    mouse: number;
    strength: number;
    relaxation: number;
  }) => void;
}

export interface ArweaveDecryptedTextProps extends ArweaveComponentProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
  onDecrypt?: (data: { text: string; isDecrypted: boolean }) => void;
}

export interface ArweaveFlowingMenuProps extends ArweaveComponentProps {
  items: Array<{
    link: string;
    text: string;
    image: string;
  }>;
  className?: string;
  onItemClick?: (data: { link: string; text: string }) => void;
}

// Lua/AO specific types
export interface LuaHandler {
  name: string;
  code: string;
  description?: string;
  parameters?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  returnType?: string;
  example?: string;
}

export interface AOProcess {
  id: string;
  name: string;
  description?: string;
  handlers: LuaHandler[];
  state?: Record<string, any>;
  onStateChange?: (state: Record<string, any>) => void;
  onMessage?: (message: any) => void;
  onError?: (error: Error) => void;
}

export interface ArweaveComponent extends ArweaveComponentProps {
  aoProcess?: AOProcess;
  luaHandlers?: LuaHandler[];
  onProcessUpdate?: (process: AOProcess) => void;
  onHandlerUpdate?: (handlers: LuaHandler[]) => void;
} 