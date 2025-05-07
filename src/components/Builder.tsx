"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useCallback, useState } from "react"
import { useBuilder } from "../hooks/useBuilder"
import type { Component } from "@/types/builder"
import { Button, type ButtonProps } from "./Button"
import { Navbar, type NavbarProps } from "./Navbar"
import { Header, type HeaderProps } from "./Header"
import GridDistortion from "./GridDistortion"
import type GridDistortionProps from "./GridDistortion"
import { NavbarDark, type NavbarDarkProps } from "./NavbarDark"
import { BottomNavbar, type BottomNavbarProps } from "./BottomNavbar"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import StarBorder from "./StarBorder"
import type { StarBorderProps } from "./StarBorder"
import WalletButton, { type WalletButtonProps } from "./WalletButton"
import LuaIDE from "./LuaIDE"
import ArDacityNavBar from "@ar-dacity/ardacity-navbar"
import ArweaveForm from "./ArweaveForm"
import MessageSignerForm from "./MessageSignerForm"
import ArweaveNFT from "./ArweaveNFT"
import CredentialsNavbar from "./CredentialsNavbar"
import type { CredentialsNavbarProps } from "./CredentialsNavbar"
import DecryptedText, { type DecryptedTextProps } from "./DecryptedText"
import FlowingMenu, { type FlowingMenuProps } from "./FlowingMenu"
import { TextPressure } from "@ar-dacity/ardacity-text-pressure"
import { downloadProject } from "@/utils/projectGenerator"
import { BuilderPermawebProfile } from "./Builder/PermawebProfile"
import { BuilderPermawebAtomicAsset } from "./Builder/PermawebAtomicAsset"
import ProcessSpawner from "./ProcessSpawner"
import AOSpawner from "./AOSpawner"
import SmoothScrollHero from "./SmoothScrollHero"
import DropdownNavbar from "./DropdownNavbar"

import { ClipPathLinks } from "./ClipPathLinks"
import { LandingPageOne } from "../components/ArDacityUi/LandingPageOne"
import Leaderboard, { type LeaderboardProps } from "./Leaderboard"
// TODO: Fix LandingPageOne import once package is properly configured
// import { LandingPageOne } from '@ar-dacity/ardacity-landing-page-one';
// import { ArdacityHeaderOne } from '@ar-dacity/ardacity-header-one';
// import { ArdacityHeaderThree } from '@ar-dacity/ardacity-header-three';

interface BuilderProps {
  availableComponents: Component[]
}

type ComponentProps =
  | ButtonProps
  | NavbarProps
  | HeaderProps
  | NavbarDarkProps
  | typeof GridDistortionProps
  | BottomNavbarProps
  | StarBorderProps
  | WalletButtonProps
  | CredentialsNavbarProps
  | DecryptedTextProps
  | FlowingMenuProps
  | LeaderboardProps

interface ComponentPreviewProps {
  key: string
  component: Component
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onShowCode: (id: string) => void
  selectedComponentId: string | null
  onPropertyChange: (key: string, value: any) => void
}

const getFullComponentCode = (component: Component) => {
  const props = { ...component.props }
  const propString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `  ${key}="${value}"`
      }
      if (typeof value === "object") {
        return `  ${key}={${JSON.stringify(value, null, 2)}}`
      }
      return `  ${key}={${value}}`
    })
    .join("\n")

  return `import ${component.type} from './components/${component.type}';\n\nconst MyComponent = () => {\n  return (\n    <${component.type}\n${propString}\n    />\n  );\n};\n\nexport default MyComponent;`
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ 
  component, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onShowCode,
  selectedComponentId,
  onPropertyChange
}) => {
  const [showFullCode, setShowFullCode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(component.id);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveUp(component.id);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDown(component.id);
  };

  const handleShowCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowCode(component.id);
  };

  const getFullComponentCode = (component: Component) => {
    const props = { ...component.props };
    const propString = Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `  ${key}="${value}"`;
        }
        if (typeof value === 'object') {
          return `  ${key}={${JSON.stringify(value, null, 2)}}`;
        }
        return `  ${key}={${value}}`;
      })
      .join('\n');

    return `import ${component.type} from './components/${component.type}';\n\nconst MyComponent = () => {\n  return (\n    <${component.type}\n${propString}\n    />\n  );\n};\n\nexport default MyComponent;`;
  };

  const defaultProps: Record<string, ComponentProps> = {
    Button: { text: 'Preview Button', variant: 'primary', size: 'md' },
    Navbar: { 
      title: 'Preview Navbar',
      variant: 'light',
      position: 'static',
      links: [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
      ]
    },
    NavbarDark: {
      title: 'Preview Navbar',
      position: 'static',
      links: [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
      ]
    },
    Header: { 
      title: 'Preview Header',
      textColor: 'light',
      height: 'md',
      ctaButton: {
        text: 'Get Started',
        href: '#',
        buttonType: 'default',
        variant: 'primary',
        size: 'md'
      }
    },
    GridDistortion: { 
      // imageSrc: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop',
      // grid: 15,
      // mouse: 0.1,
      // strength: 0.15,
      // relaxation: 0.9
    },
    BottomNavbar: {
      activeTab: 'home',
      onTabChange: () => {},
    },
    StarBorder: {
      children: 'Star Border Button',
      color: '#007bff',
      speed: '6s',
    },
    wallet: {
      variant: 'default',
      size: 'md',
      showAddress: false,
      addressDisplayLength: 6,
      luaCode: `-- Add your Lua handlers here
-- Example:
-- function onConnect(address)
--   print('Connected:', address)
-- end

-- function onDisconnect()
--   print('Disconnected')
-- end`,
      aoProcessId: '',
      className: '',
      style: {}
    },
    'ardacity-navbar': {
      // brand: 'Your Brand',
      // links: [
      //   { label: 'Home', href: '/', isActive: true },
      //   { label: 'About', href: '/about' }
      // ],
      // showWalletButton: true,
      variant: 'default',
      // position: 'sticky'
    },
    'arweave-form': {
      title: 'Create Arweave Transaction',
      // description: 'Submit transactions with Lua handlers',
      initialLuaCode: `-- Add your Lua handlers here
function onConnect(address)
  print('Connected:', address)
end

function onDisconnect()
  print('Disconnected')
end

function onTransaction(tx)
  print('Transaction:', tx)
end`,
      // onSubmit: (data) => {
      //   console.log('Form submitted:', data);
      // }
    },
    'message-signer': {
      title: 'Sign Message with Lua',
      // description: 'Sign messages using Lua handlers and Arweave wallet',
      initialLuaCode: `-- Message signing handler
function signMessage(message)
  -- Get the wallet address
  local address = ao.getActiveAddress()
  
  -- Create a signature
  local signature = ao.signMessage(message)
  
  -- Return the signature
  return {
    address = address,
    signature = signature
  }
end

-- Example usage:
-- local result = signMessage("Hello, Arweave!")
-- print("Address:", result.address)
-- print("Signature:", result.signature)`,
      // onSign: (data: { message: string; signature: string; luaCode: string }) => {
      //   console.log('Message signed:', data);
      // }
    },
    'nft': {
      title: 'My Arweave NFT',
      // description: 'View and transfer your Arweave NFT',
      // imageUrl: 'https://arweave.net/your-nft-image',
      // tokenId: 'your-token-id',
      // owner: 'your-wallet-address',
      initialLuaCode: `-- NFT transfer handler
function transferNFT(to, tokenId)
  -- Get the current owner
  local currentOwner = ao.getActiveAddress()
  
  -- Check if the sender is the owner
  if currentOwner ~= owner then
    return {
      success = false,
      error = "Only the owner can transfer this NFT"
    }
  end
  
  -- Transfer the NFT
  local result = ao.transferNFT(to, tokenId)
  
  -- Return the result
  return {
    success = true,
    transactionId = result.id
  }
end

-- Example usage:
-- local result = transferNFT("recipient-address", "token-id")
-- print("Transfer result:", result)`,
      // onTransfer: (data) => {
      //   console.log('NFT Transfer:', data);
      // }
    },
    'credentials-navbar': {
      activeTab: 'home',
      onTabChange: (tab: string) => console.log('Tab changed:', tab),
      socialLinks: {
        instagram: 'https://instagram.com/your-username',
        twitter: 'https://twitter.com/your-username',
        facebook: 'https://facebook.com/your-username',
        linkedin: 'https://linkedin.com/in/your-username',
        github: 'https://github.com/your-username',
        discord: 'https://discord.gg/your-server',
        telegram: 'https://t.me/your-username'
      }
    },
    DecryptedText: {
      text: 'Decrypted Text',
      speed: 50,
      maxIterations: 10,
      sequential: false,
      revealDirection: 'start',
      useOriginalCharsOnly: false,
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      className: 'text-blue-500',
      parentClassName: 'text-2xl font-bold',
      encryptedClassName: 'text-gray-400',
      animateOn: 'hover'
    },
    FlowingMenu: {
      items: [
        {
          link: '#',
          text: 'Home',
          image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop'
        },
        {
          link: '#',
          text: 'About',
          image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop'
        },
        {
          link: '#',
          text: 'Contact',
          image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      className: 'h-screen'
    },
    TextPressure: {
      text: 'Press me!',
   
   
    },
    'leaderboard': {
      processId: 'N_boXL20JQirhENJyfml_Geaa5cofYG8BieNA0uKZ6U',
      title: 'AO Leaderboard',
      limit: 10
    },
  };

  const props = { ...defaultProps[component.type], ...component.props } as ComponentProps;

  const renderComponent = () => {
    switch (component.type) {
      case 'Button':
        return <Button {...(props as ButtonProps)} />;
      case 'Navbar':
        return <Navbar {...(props as NavbarProps)} />;
      case 'NavbarDark':
        return <NavbarDark {...(props as NavbarDarkProps)} />;
      case 'Header':
        return <Header {...(props as HeaderProps)} />;
      case 'GridDistortion':
        return <GridDistortion imageSrc={''} {...(props as typeof GridDistortionProps)} />;
      case 'BottomNavbar':
        return <BottomNavbar {...(props as BottomNavbarProps)} />;
      case 'StarBorder':
        return <StarBorder {...(props as StarBorderProps)} />;
      case 'wallet':
        return <WalletButton {...(props as WalletButtonProps)} />;
      case 'ardacity-navbar':
        return <ArDacityNavBar {...(props as any)} />;
      case 'arweave-form':
        return <ArweaveForm {...(props as any)} />;
      case 'message-signer':
        return <MessageSignerForm {...(props as any)} />;
      case 'nft':
        return (
          <ArweaveNFT
            {...props}
            onTransfer={(data) => {
              console.log('NFT Transfer:', data);
              // if (props.onTransfer) {
              //   props.onTransfer(data);
              // }
            }}
          />
        );
      case 'credentials-navbar':
        return <CredentialsNavbar {...(props as CredentialsNavbarProps)} />;
      case 'DecryptedText':
        return <DecryptedText {...(props as DecryptedTextProps)} />;
      case 'FlowingMenu':
        return <FlowingMenu {...(props as FlowingMenuProps)} />;
      case 'TextPressure':
        return (
          <div className="relative w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <TextPressure {...component.props} />
            </div>
          </div>
        );
      case 'PermawebProfile':
        return <BuilderPermawebProfile component={component} onPropertyChange={onPropertyChange} />;
      case 'PermawebAtomicAsset':
        return <BuilderPermawebAtomicAsset component={component} onPropertyChange={onPropertyChange} />;
      case 'ProcessSpawner':
        return <ProcessSpawner {...(props as any)} />;
      case 'AOSpawner':
        return <AOSpawner {...(props as any)} />;
      case 'smooth-scroll-hero':
        return <SmoothScrollHero {...(props as any)} />;
      case 'dropdown-navbar':
        return <DropdownNavbar {...(props as any)} />;
      case 'clip-path-links':
        return <ClipPathLinks {...(props as any)} />;
      case 'landing-page-one':
        return <LandingPageOne {...(props as any)} />;
      case 'leaderboard':
        return <Leaderboard {...(props as LeaderboardProps)} />;
      default:
        return <div>{component.name}</div>;
    }
  };

  return (
    <div 
      className="relative w-full group mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute right-3 top-3 z-[100]">
        <div className={`bg-black/90 backdrop-blur-sm rounded-lg shadow-lg p-1.5 flex space-x-1.5 transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button
            onClick={handleRemove}
            className="p-1.5 text-red-400 rounded-md hover:bg-zinc-800 hover:text-red-300 transition-colors"
            title="Delete component"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={handleMoveUp}
            className="p-1.5 text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-white transition-colors"
            title="Move up"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={handleMoveDown}
            className="p-1.5 text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-white transition-colors"
            title="Move down"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleShowCode}
            className={`p-1.5 rounded-md transition-colors ${
              selectedComponentId === component.id
                ? 'bg-white/20 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Show code"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              const code = getFullComponentCode(component);
              const blob = new Blob([code], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${component.type}.jsx`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="p-1.5 text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-white transition-colors"
            title="Download code"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={`relative transition-all duration-200 ${
        isHovered ? 'ring-2 ring-white ring-opacity-70 shadow-lg' : ''
      }`}>
        <div className={`absolute -top-3 left-3 z-10 px-2 py-1 text-xs font-medium rounded ${
          isHovered ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'
        } transition-colors`}>
          {component.name}
        </div>
        {renderComponent()}
      </div>
    </div>
  );}

const PropertiesPanel: React.FC<{
  component: Component | null;
  onPropertyChange: (key: string, value: any) => void;
  onRemove?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onShowCode?: (id: string) => void;
  selectedComponentId: string | null;
}> = ({ component, onPropertyChange, onRemove, onMoveUp, onMoveDown, onShowCode, selectedComponentId }) => {
  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-zinc-500">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-lg">No Component Selected</p>
        <p className="text-sm mt-2 text-center">Select a component from the canvas to edit its properties</p>
      </div>
    );
  }

  const renderProperties = () => {
    switch (component.type) {
      case 'wallet':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Variant
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.variant || 'default'}
                onChange={(e) => onPropertyChange('variant', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="outline">Outline</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.size || 'md'}
                onChange={(e) => onPropertyChange('size', e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Show Address
              </label>
              <input
                type="checkbox"
                checked={component.props.showAddress || false}
                onChange={(e) => onPropertyChange('showAddress', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            {component.props.showAddress && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Display Length
                </label>
                <input
                  type="number"
                  value={component.props.addressDisplayLength || 6}
                  onChange={(e) => onPropertyChange('addressDisplayLength', Number.parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  min="4"
                  max="64"
                />
              </div>
            )}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Lua Handlers</h4>
              <div className="border rounded-lg overflow-hidden">
                <LuaIDE
                  cellId={`wallet-${component.id}`}
                  initialCode={component.props.luaCode || `-- Add your Lua handlers here
-- Example:
-- function onConnect(address)
--   print('Connected:', address)
-- end

-- function onDisconnect()
--   print('Disconnected')
-- end`}
                  onProcessId={(pid) => {
                    console.log("Using process:", pid);
                    onPropertyChange('aoProcessId', pid);
                  }}
                  onNewMessage={(msgs) => {
                    console.log("New messages:", msgs);
                    onPropertyChange('lastMessages', msgs);
                  }}
                  onInbox={(inbox) => {
                    console.log("Got inbox:", inbox);
                    onPropertyChange('inbox', inbox);
                  }}
                />
              </div>
            </div>
          </>
        );
      case 'Header':
        if (component.props.ctaButton) {
          return (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Button Type
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.ctaButton.buttonType || 'default'}
                onChange={(e) => onPropertyChange('ctaButton.buttonType', e.target.value)}
              >
                <option value="default">Default Button</option>
                <option value="primary">Primary Button</option>
                <option value="secondary">Secondary Button</option>
                <option value="outline">Outline Button</option>
                <option value="star">Star Border Button</option>
              </select>
            </div>
          );
        }
        return null;
      case 'ardacity-navbar':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                value={component.props.brand || ''}
                onChange={(e) => onPropertyChange('brand', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Variant
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.variant || 'default'}
                onChange={(e) => onPropertyChange('variant', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="minimal">Minimal</option>
                <option value="transparent">Transparent</option>
                <option value="accent">Accent</option>
                <option value="glass">Glass</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.position || 'static'}
                onChange={(e) => onPropertyChange('position', e.target.value)}
              >
                <option value="static">Static</option>
                <option value="sticky">Sticky</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
          </>
        );
      case 'ardacity-header-one':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={component.props.name || ''}
                onChange={(e) => onPropertyChange('name', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={component.props.title || ''}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Images (comma-separated URLs)
              </label>
              <input
                type="text"
                value={component.props.images?.join(',') || ''}
                onChange={(e) => onPropertyChange('images', e.target.value.split(',').map(url => url.trim()))}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>
          </>
        );
      case 'ardacity-header-three':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image Source
              </label>
              <input
                type="text"
                value={component.props.imageSrc || ''}
                onChange={(e) => onPropertyChange('imageSrc', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={component.props.title || ''}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Grid
              </label>
              <input
                type="number"
                value={component.props.grid || 10}
                onChange={(e) => onPropertyChange('grid', Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="1"
                max="20"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mouse Sensitivity
              </label>
              <input
                type="number"
                value={component.props.mouse || 0.5}
                onChange={(e) => onPropertyChange('mouse', Number.parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Strength
              </label>
              <input
                type="number"
                value={component.props.strength || 0.5}
                onChange={(e) => onPropertyChange('strength', Number.parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Relaxation
              </label>
              <input
                type="number"
                value={component.props.relaxation || 0.5}
                onChange={(e) => onPropertyChange('relaxation', Number.parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </>
        );
      case 'arweave-form':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={component.props.title || ''}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={component.props.description || ''}
                onChange={(e) => onPropertyChange('description', e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Initial Lua Code
              </label>
              <textarea
                value={component.props.initialLuaCode || ''}
                onChange={(e) => onPropertyChange('initialLuaCode', e.target.value)}
                className="w-full p-2 border rounded-md font-mono"
                rows={10}
              />
            </div>
          </>
        );
      case 'message-signer':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={component.props.title || ''}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={component.props.description || ''}
                onChange={(e) => onPropertyChange('description', e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Initial Lua Code
              </label>
              <textarea
                value={component.props.initialLuaCode || ''}
                onChange={(e) => onPropertyChange('initialLuaCode', e.target.value)}
                className="w-full p-2 border rounded-md font-mono"
                rows={10}
              />
            </div>
          </>
        );
      case 'nft':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={component.props.title}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={component.props.description}
                onChange={(e) => onPropertyChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={component.props.imageUrl}
                onChange={(e) => onPropertyChange('imageUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Token ID</label>
              <input
                type="text"
                value={component.props.tokenId}
                onChange={(e) => onPropertyChange('tokenId', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Owner</label>
              <input
                type="text"
                value={component.props.owner}
                onChange={(e) => onPropertyChange('owner', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lua Code</label>
              <textarea
                value={component.props.initialLuaCode}
                onChange={(e) => onPropertyChange('initialLuaCode', e.target.value)}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'credentials-navbar':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Active Tab
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.activeTab || 'home'}
                onChange={(e) => onPropertyChange('activeTab', e.target.value)}
              >
                <option value="home">Home</option>
              </select>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Social Media Links</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600">Instagram</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.instagram || ''}
                    onChange={(e) => onPropertyChange('socialLinks.instagram', e.target.value)}
                    placeholder="https://instagram.com/your-username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Twitter</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.twitter || ''}
                    onChange={(e) => onPropertyChange('socialLinks.twitter', e.target.value)}
                    placeholder="https://twitter.com/your-username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Facebook</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.facebook || ''}
                    onChange={(e) => onPropertyChange('socialLinks.facebook', e.target.value)}
                    placeholder="https://facebook.com/your-username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">LinkedIn</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.linkedin || ''}
                    onChange={(e) => onPropertyChange('socialLinks.linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/your-username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">GitHub</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.github || ''}
                    onChange={(e) => onPropertyChange('socialLinks.github', e.target.value)}
                    placeholder="https://github.com/your-username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Discord</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.discord || ''}
                    onChange={(e) => onPropertyChange('socialLinks.discord', e.target.value)}
                    placeholder="https://discord.gg/your-server"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Telegram</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={component.props.socialLinks?.telegram || ''}
                    onChange={(e) => onPropertyChange('socialLinks.telegram', e.target.value)}
                    placeholder="https://t.me/your-username"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 'DecryptedText':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Text
              </label>
              <input
                type="text"
                value={component.props.text || ''}
                onChange={(e) => onPropertyChange('text', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Speed (ms)
              </label>
              <input
                type="number"
                value={component.props.speed || 50}
                onChange={(e) => onPropertyChange('speed', Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="10"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Iterations
              </label>
              <input
                type="number"
                value={component.props.maxIterations || 10}
                onChange={(e) => onPropertyChange('maxIterations', Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="1"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sequential
              </label>
              <input
                type="checkbox"
                checked={component.props.sequential || false}
                onChange={(e) => onPropertyChange('sequential', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reveal Direction
              </label>
              <select
                value={component.props.revealDirection || 'start'}
                onChange={(e) => onPropertyChange('revealDirection', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Use Original Characters Only
              </label>
              <input
                type="checkbox"
                checked={component.props.useOriginalCharsOnly || false}
                onChange={(e) => onPropertyChange('useOriginalCharsOnly', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Characters
              </label>
              <input
                type="text"
                value={component.props.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'}
                onChange={(e) => onPropertyChange('characters', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Class Name
              </label>
              <input
                type="text"
                value={component.props.className || ''}
                onChange={(e) => onPropertyChange('className', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Parent Class Name
              </label>
              <input
                type="text"
                value={component.props.parentClassName || ''}
                onChange={(e) => onPropertyChange('parentClassName', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Encrypted Class Name
              </label>
              <input
                type="text"
                value={component.props.encryptedClassName || ''}
                onChange={(e) => onPropertyChange('encryptedClassName', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Animate On
              </label>
              <select
                value={component.props.animateOn || 'hover'}
                onChange={(e) => onPropertyChange('animateOn', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="hover">Hover</option>
                <option value="view">View</option>
              </select>
            </div>
          </>
        );
      case 'FlowingMenu':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Menu Items
              </label>
              <div className="space-y-4">
                {(component.props.items || []).map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Link
                      </label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => {
                          const newItems = [...(component.props.items || [])];
                          newItems[index] = { ...newItems[index], link: e.target.value };
                          onPropertyChange('items', newItems);
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Text
                      </label>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          const newItems = [...(component.props.items || [])];
                          newItems[index] = { ...newItems[index], text: e.target.value };
                          onPropertyChange('items', newItems);
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const newItems = [...(component.props.items || [])];
                          newItems[index] = { ...newItems[index], image: e.target.value };
                          onPropertyChange('items', newItems);
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newItems = [...(component.props.items || [])];
                        newItems.splice(index, 1);
                        onPropertyChange('items', newItems);
                      }}
                      className="mt-2 px-3 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(component.props.items || [])];
                    newItems.push({
                      link: '#',
                      text: 'New Item',
                      image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop'
                    });
                    onPropertyChange('items', newItems);
                  }}
                  className="w-full px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Add Menu Item
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Class Name
              </label>
              <input
                type="text"
                value={component.props.className || ''}
                onChange={(e) => onPropertyChange('className', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </>
        );
      case 'TextPressure':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Text
              </label>
              <input
                type="text"
                value={component.props.text || ''}
                onChange={(e) => onPropertyChange('text', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Text Color
              </label>
              <input
                type="color"
                value={component.props.textColor || '#000'}
                onChange={(e) => onPropertyChange('textColor', e.target.value)}
                className="w-full h-10 p-1 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Stroke Color
              </label>
              <input
                type="color"
                value={component.props.strokeColor || '#ff0000'}
                onChange={(e) => onPropertyChange('strokeColor', e.target.value)}
                className="w-full h-10 p-1 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Font Size
              </label>
              <input
                type="number"
                value={component.props.minFontSize || 36}
                onChange={(e) => onPropertyChange('minFontSize', Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="12"
                max="72"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Effects
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.flex}
                    onChange={(e) => onPropertyChange('flex', e.target.checked)}
                    className="mr-2"
                  />
                  Flex
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.alpha}
                    onChange={(e) => onPropertyChange('alpha', e.target.checked)}
                    className="mr-2"
                  />
                  Alpha
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.stroke}
                    onChange={(e) => onPropertyChange('stroke', e.target.checked)}
                    className="mr-2"
                  />
                  Stroke
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.width}
                    onChange={(e) => onPropertyChange('width', e.target.checked)}
                    className="mr-2"
                  />
                  Width
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.weight}
                    onChange={(e) => onPropertyChange('weight', e.target.checked)}
                    className="mr-2"
                  />
                  Weight
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.props.italic}
                    onChange={(e) => onPropertyChange('italic', e.target.checked)}
                    className="mr-2"
                  />
                  Italic
                </label>
              </div>
            </div>
          </>
        );
      case 'PermawebProfile':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile ID
              </label>
              <input
                type="text"
                value={component.props.profileId || ''}
                onChange={(e) => onPropertyChange('profileId', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Wallet Address
              </label>
              <input
                type="text"
                value={component.props.walletAddress || ''}
                onChange={(e) => onPropertyChange('walletAddress', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Lua Handler Code
              </label>
              <textarea
                value={component.props.luaCode || ''}
                onChange={(e) => onPropertyChange('luaCode', e.target.value)}
                className="w-full p-2 border rounded-md font-mono"
                rows={10}
              />
            </div>
          </>
        );
      case 'PermawebAtomicAsset':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Asset ID
              </label>
              <input
                type="text"
                value={component.props.assetId || ''}
                onChange={(e) => onPropertyChange('assetId', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Asset IDs (comma-separated)
              </label>
              <input
                type="text"
                value={component.props.assetIds?.join(',') || ''}
                onChange={(e) => onPropertyChange('assetIds', e.target.value.split(',').map(id => id.trim()))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Lua Handler Code
              </label>
              <textarea
                value={component.props.luaCode || ''}
                onChange={(e) => onPropertyChange('luaCode', e.target.value)}
                className="w-full p-2 border rounded-md font-mono"
                rows={10}
              />
            </div>
          </>
        );
      case 'leaderboard':
        return (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Process ID
              </label>
              <input
                type="text"
                value={component.props.processId || 'N_boXL20JQirhENJyfml_Geaa5cofYG8BieNA0uKZ6U'}
                onChange={(e) => onPropertyChange('processId', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={component.props.title || 'AO Leaderboard'}
                onChange={(e) => onPropertyChange('title', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Default Display Limit
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={component.props.limit || 10}
                onChange={(e) => onPropertyChange('limit', Number.parseInt(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-4 px-4 pt-4">{component.name}</h3>
      
      {/* Features Section */}
      <div className="mb-6 p-4 bg-zinc-900 rounded-lg mx-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          Actions
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => onRemove?.(component.id)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Component
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onMoveUp?.(component.id)}
              className="flex-1 flex items-center justify-center px-4 py-2 text-sm text-white bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Move Up
            </button>
            <button
              onClick={() => onMoveDown?.(component.id)}
              className="flex-1 flex items-center justify-center px-4 py-2 text-sm text-white bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Move Down
            </button>
          </div>
          <button
            onClick={() => onShowCode?.(component.id)}
            className={`w-full flex items-center justify-center px-4 py-2 text-sm ${
              selectedComponentId === component.id
                ? 'text-white bg-white/10 border-white/30'
                : 'text-white bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
            } border rounded-md transition-colors`}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            View Code
          </button>
          <button
            onClick={() => {
              const code = getFullComponentCode(component);
              const blob = new Blob([code], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${component.type}.jsx`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Code
          </button>
        </div>
      </div>

      {/* Component Properties */}
      <div className="space-y-4 px-4 pb-6">
        <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Properties
        </h4>
        <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
          {renderProperties()}
        </div>
      </div>

      {/* Code Preview */}
      {selectedComponentId === component.id && (
        <div className="mt-6 p-4 bg-zinc-900 rounded-lg mx-4 mb-6">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code Preview
          </h4>
          <div className="relative rounded-lg overflow-hidden">
          <SyntaxHighlighter language="jsx" style={atomDark} className="text-sm">
              {getFullComponentCode(component)}
            </SyntaxHighlighter>
            
            <button
              onClick={() => {
                const code = getFullComponentCode(component);
                // navigator.clipboard.writeText(code);
              }}
              className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white bg-zinc-900/90 rounded-md hover:bg-zinc-800 transition-colors"
              title="Copy code"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Builder: React.FC<BuilderProps> = ({ availableComponents }) => {
  const { state, addComponent, removeComponent, selectComponent, moveComponent, updateComponent } = useBuilder();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, component: Component) => {
      e.dataTransfer.setData('component', JSON.stringify(component));
      setDraggedComponent(component);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropZoneId: string) => {
      e.preventDefault();
      const componentData = e.dataTransfer.getData('component');
      if (componentData) {
        const component = JSON.parse(componentData);
        addComponent(component, dropZoneId);
      }
      setDraggedComponent(null);
    },
    [addComponent]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMoveUp = useCallback((componentId: string) => {
    console.log('Moving up:', componentId);
    moveComponent(componentId, 'up');
  }, [moveComponent]);

  const handleMoveDown = useCallback((componentId: string) => {
    console.log('Moving down:', componentId);
    moveComponent(componentId, 'down');
  }, [moveComponent]);

  const handleRemoveComponent = useCallback((componentId: string) => {
    console.log('Removing component:', componentId);
    removeComponent(componentId);
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [removeComponent, selectedComponentId]);

  const handleShowCode = useCallback((componentId: string) => {
    setSelectedComponentId(componentId);
  }, []);

  const handlePropertyChange = useCallback((componentId: string, key: string, value: any) => {
    const component = state.dropZones
      .flatMap((zone) => zone.children)
      .find((comp) => comp.id === componentId);

    if (!component) return;

    const updatedProps = { ...component.props };
    const keys = key.split('.');
    let current = updatedProps;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    updateComponent(componentId, updatedProps);
  }, [state.dropZones, updateComponent]);

  const getSelectedComponent = () => {
    if (!selectedComponentId) return null;
    return state.dropZones
      .flatMap((zone) => zone.children)
      .find((comp) => comp.id === selectedComponentId) || null;
  };

  const renderComponentCode = (component: Component) => {
    switch (component.type) {
      case 'wallet':
        return `<WalletButton
  variant="${component.props.variant || 'default'}"  // Toggle between: 'default', 'outline', 'minimal'
  size="${component.props.size || 'md'}"  // Toggle between: 'sm', 'md', 'lg'
  ${component.props.showAddress ? `showAddress={${component.props.showAddress}}` : ''}
  ${component.props.addressDisplayLength ? `addressDisplayLength={${component.props.addressDisplayLength}}` : ''}
  ${component.props.label ? `label={${JSON.stringify(component.props.label)}}` : ''}
  ${component.props.onConnect ? `onConnect={(address) => console.log('Connected:', address)}` : ''}
  ${component.props.onDisconnect ? `onDisconnect={() => console.log('Disconnected')}` : ''}
  className="${component.props.className || ''}"
  ${component.props.style ? `style={${JSON.stringify(component.props.style)}}` : ''}
/>`;
      default:
        return getFullComponentCode(component);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Components Panel */}
      <div className="w-72 flex-shrink-0 bg-black overflow-y-auto border-r border-zinc-800">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Components
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {availableComponents.map((component) => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                className="p-3 bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 cursor-move hover:shadow-md hover:border-white hover:bg-zinc-800 transition-all group"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-white group-hover:bg-zinc-700 transition-colors">
                    {component.type.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-center text-zinc-400 text-sm group-hover:text-white transition-colors">{component.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Builder Canvas */}
      <div className="flex-1 flex flex-col min-h-0 bg-black">
        {/* Toolbar */}
        <div className="flex-shrink-0 p-3 bg-black border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  isPreviewMode
                    ? 'bg-white text-black hover:bg-zinc-200'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isPreviewMode ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} 
                  />
                </svg>
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
            </div>
            <button
              onClick={() => downloadProject(state.dropZones.flatMap(zone => zone.children))}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Project
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          <div
            className={`min-h-full ${
              isPreviewMode ? '' : 'border-2 border-dashed border-zinc-800 bg-zinc-900/20'
            } rounded-lg p-6`}
            onDrop={(e) => {
              handleDrop(e, 'root');
              setSelectedComponentId(null);
            }}
            onDragOver={handleDragOver}
          >
            {state.dropZones.flatMap(zone => zone.children).length === 0 && !isPreviewMode && (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Drag and drop components here</p>
                <p className="text-sm mt-2">Components will appear in this canvas area</p>
              </div>
            )}
            <div className="space-y-6">
              {state.dropZones.map((zone) => (
                <div key={zone.id} className="w-full">
                  {zone.children.map((component) => (
                    <ComponentPreview
                      key={component.id}
                      component={component}
                      onRemove={handleRemoveComponent}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onShowCode={handleShowCode}
                      selectedComponentId={selectedComponentId}
                      onPropertyChange={(key, value) => {
                        if (component.id) {
                          handlePropertyChange(component.id, key, value);
                        }
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 flex-shrink-0 border-l border-zinc-800 bg-black overflow-y-auto">
        <div className="sticky top-0 z-10 bg-black border-b border-zinc-800 p-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Properties
          </h2>
        </div>
        <PropertiesPanel
          component={getSelectedComponent()}
          onPropertyChange={(key, value) => {
            if (selectedComponentId) {
              handlePropertyChange(selectedComponentId, key, value);
            }
          }}
          onRemove={handleRemoveComponent}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onShowCode={handleShowCode}
          selectedComponentId={selectedComponentId}
        />
      </div>
    </div>
  );
};
export default Builder;