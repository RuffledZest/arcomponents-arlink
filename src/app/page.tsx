'use client';
import dynamic from 'next/dynamic';
import { Component } from '@/types/builder';

// Dynamic import with SSR disabled
const Builder = dynamic(() => import('../components/Builder'), {
  ssr: false,
});

// Dynamically load your component



const availableComponents: Component[] = [
  {
    id: 'ardacity-navbar-1',
    name: 'ArDacity Navbar',
    type: 'ardacity-navbar',
    props: {
      brand: 'Your Brand',
      links: [
        { label: 'Home', href: '/', isActive: true },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ],
      showWalletButton: true,
      variant: 'default',
      position: 'sticky',
      themeColor: '#4f46e5'
    }
  },
  {
    id: 'navbar-light-1',
    name: 'Light Navbar',
    type: 'Navbar',
    props: {
      title: 'My Website',
      variant: 'light',
      position: 'static',
      links: [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  },
  {
    id: 'navbar-dark-1',
    name: 'Dark Navbar',
    type: 'Navbar',
    props: {
      title: 'My Website',
      variant: 'dark',
      position: 'fixed',
      links: [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  },
  {
    id: 'bottom-navbar-1',
    name: 'Bottom Navbar',
    type: 'BottomNavbar',
    props: {
      activeTab: 'home',
      onTabChange: (tab: string) => console.log('Tab changed:', tab),
    },
  },
  {
    id: 'header-hero-1',
    name: 'Hero Header',
    type: 'Header',
    props: {
      title: 'Welcome to Our Website',
      subtitle: 'Create amazing things with our components',
      height: 'lg',
      textColor: 'light',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526022997c',
      ctaButton: {
        text: 'Get Started',
        href: '#',
        type: 'star',
        variant: 'primary',
        size: 'lg'
      },
    },
  },
  {
    id: 'header-hero-2',
    name: 'Hero Header (Primary Button)',
    type: 'Header',
    props: {
      title: 'Modern Design',
      subtitle: 'Build beautiful websites',
      height: 'lg',
      textColor: 'light',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526022997c',
      ctaButton: {
        text: 'Explore Now',
        href: '#',
        type: 'primary',
        variant: 'primary',
        size: 'lg'
      },
    },
  },
  {
    id: 'header-hero-3',
    name: 'Hero Header (Outline Button)',
    type: 'Header',
    props: {
      title: 'Creative Solutions',
      subtitle: 'Design without limits',
      height: 'lg',
      textColor: 'light',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526022997c',
      ctaButton: {
        text: 'Learn More',
        href: '#',
        type: 'outline',
        variant: 'outline',
        size: 'lg'
      },
    },
  },
  {
    id: 'header-hero-4',
    name: 'Hero Header (Dark Theme)',
    type: 'Header',
    props: {
      title: 'Dark Mode Ready',
      subtitle: 'Perfect for any theme',
      height: 'lg',
      textColor: 'dark',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526022997c',
      overlayColor: 'rgba(255, 255, 255, 0.8)',
      ctaButton: {
        text: 'Try Dark Mode',
        href: '#',
        type: 'primary',
        variant: 'primary',
        size: 'lg'
      },
    },
  },
  {
    id: 'smooth-scroll-hero-1',
    name: 'Smooth Scroll Hero',
    type: 'smooth-scroll-hero',
    props: {
      backgroundImage: "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      parallaxImages: [
        {
          src: "https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "And example of a space launch",
          start: -200,
          end: 200,
          className: "w-1/3"
        },
        {
          src: "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "An example of a space launch",
          start: 200,
          end: -250,
          className: "mx-auto w-2/3"
        },
        {
          src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Orbiting satellite",
          start: -200,
          end: 200,
          className: "ml-auto w-1/3"
        },
        {
          src: "https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Orbiting satellite",
          start: 0,
          end: -500,
          className: "ml-24 w-5/12"
        }
      ],
      scheduleItems: [
        { title: "NG-21", date: "Dec 9th", location: "Florida" },
        { title: "Starlink", date: "Dec 20th", location: "Texas" },
        { title: "Starlink", date: "Jan 13th", location: "Florida" },
        { title: "Turksat 6A", date: "Feb 22nd", location: "Florida" },
        { title: "NROL-186", date: "Mar 1st", location: "California" },
        { title: "GOES-U", date: "Mar 8th", location: "California" },
        { title: "ASTRA 1P", date: "Apr 8th", location: "Texas" }
      ]
    }
  },
  {
    id: 'nft-1',
    name: 'Arweave NFT',
    type: 'nft',
    props: {
      title: 'My Arweave NFT',
      description: 'View and transfer your Arweave NFT',
      imageUrl: 'https://arweave.net/your-nft-image',
      tokenId: 'your-token-id',
      owner: 'your-wallet-address',
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
      onTransfer: (data) => {
        console.log('NFT Transfer:', data);
      }
    }
  },
  {
    id: 'grid-distortion-1',
    name: 'Grid Distortion',
    type: 'GridDistortion',
    props: {
      imageSrc: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop',
      grid: 15,
      mouse: 0.1,
      strength: 0.15,
      relaxation: 0.9
    },
  },
  {
    id: 'button-primary-1',
    name: 'Primary Button',
    type: 'Button',
    props: {
      text: 'Click me',
      variant: 'primary',
      size: 'md',
    },
  },
  {
    id: 'button-secondary-1',
    name: 'Secondary Button',
    type: 'Button',
    props: {
      text: 'Secondary',
      variant: 'secondary',
      size: 'md',
    },
  },
  {
    id: 'button-outline-1',
    name: 'Outline Button',
    type: 'Button',
    props: {
      text: 'Outline',
      variant: 'outline',
      size: 'md',
    },
  },
  {
    id: 'star-border-1',
    name: 'Star Border',
    type: 'StarBorder',
    props: {
      children: 'Star Border Button',
      color: '#007bff',
      speed: '6s',
    },
  },
  {
    id: 'wallet-button-1',
    name: 'Wallet Button',
    type: 'wallet',
    props: {
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
    }
  },
  
  {
    id: 'arweave-form-1',
    name: 'Arweave Transaction Form',
    type: 'arweave-form',
    props: {
      title: 'Create Arweave Transaction',
      description: 'Submit transactions with Lua handlers',
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
      onSubmit: (data) => {
        console.log('Form submitted:', data);
      }
    }
  },
  {
    id: 'message-signer-1',
    name: 'Message Signer',
    type: 'message-signer',
    props: {
      title: 'Sign Message with Lua',
      description: 'Sign messages using Lua handlers and Arweave wallet',
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
      onSign: (data: { message: string; signature: string; luaCode: string }) => {
        console.log('Message signed:', data);
      }
    }
  },
  
  {
    id: 'credentials-navbar-1',
    name: 'Social Media Navbar',
    type: 'credentials-navbar',
    props: {
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
    }
  },
  {
    id: 'decrypted-text-1',
    name: 'Decrypted Text',
    type: 'DecryptedText',
    props: {
      text: 'Welcome to the Decrypted Text Component',
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
    }
  },
  {
    id: 'flowing-menu-1',
    name: 'Flowing Menu',
    type: 'FlowingMenu',
    props: {
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
    }
  },
  {
    id: 'text-pressure-1',
    name: 'Text Pressure',
    type: 'TextPressure',
    props: {
      text: 'Press me!',
      flex: true,
      alpha: false,
      stroke: true,
      width: true,
      weight: true,
      italic: true,
      textColor: '#000000',
      strokeColor: '#ffffff',
      minFontSize: 48,
      fontFamily: 'Arial',
      fontUrl: ''
    },
  },
  {
    id: 'permaweb-profile-1',
    name: 'Permaweb Profile',
    type: 'PermawebProfile',
    props: {
      profileId: '',
      walletAddress: '',
      luaCode: `-- Profile handler
function onProfileCreated(profileId)
  print('Profile created:', profileId)
  -- You can store this ID to use with assets
  return profileId
end

function onProfileUpdated(profileId)
  print('Profile updated:', profileId)
end

-- Example profile data
local profileData = {
  username = "testuser",
  displayName = "Test User",
  description = "This is a test profile"
}

-- Example usage:
-- local profileId = createProfile({
--   username = "myusername",
--   displayName = "My Display Name",
--   description = "My profile description"
-- })
-- onProfileCreated(profileId)`
    },
  },
  {
    id: 'permaweb-atomic-asset-1',
    name: 'Permaweb Atomic Asset',
    type: 'PermawebAtomicAsset',
    props: {
      assetId: '',
      assetIds: [],
      luaCode: `-- Atomic Asset handler
function onAssetCreated(assetId)
  print('Asset created:', assetId)
  -- You can store this ID to view the asset later
  return assetId
end

function onAssetUpdated(assetId)
  print('Asset updated:', assetId)
end

-- Example asset data
local assetData = {
  name = "Test Asset",
  description = "This is a test asset",
  topics = {"test", "example"},
  data = "Hello, Permaweb!",
  contentType = "text/plain",
  assetType = "document"
}

-- Example usage:
-- local assetId = createAtomicAsset({
--   name = "My Asset",
--   description = "My asset description",
--   topics = {"topic1", "topic2"}
-- })
-- onAssetCreated(assetId)`
    },
  },
  {
    id: 'process-spawner-1',
    name: 'Process Spawner',
    type: 'ProcessSpawner',
    props: {
      onProcessSpawned: (processId: string) => {
        console.log('Process spawned:', processId);
      }
    }
  },
  {
    id: 'ao-spawner-1',
    name: 'AO Process Spawner',
    type: 'AOSpawner',
    props: {
      luaCode: `-- Basic process spawning
local process_id = ao.spawn([==[
  Name = "MyProcess"
  Inbox = {}
  Handlers = {}
  ao = {
    id = ao.id,
    send = ao.send,
    spawn = ao.spawn
  }

  -- Handler example
  Handlers.add(
    "ping",
    {Action = "Ping"},
    function(msg)
      ao.send({
        Target = msg.From,
        Data = "Pong"
      })
    end
  )
]==])

-- Verify process creation
assert(process_id ~= nil, "Failed to spawn process")

-- Test the process
ao.send({
  Target = process_id,
  Action = "Ping"
})

-- Return process ID for verification
return { process_id = process_id }`
    }
  },
  
  {
    id: 'dropdown-navbar-1',
    name: 'Dropdown Navbar',
    type: 'dropdown-navbar',
    props: {
      className: '',
      style: {}
    }
  },
  {
    id: 'clip-path-links-1',
    name: 'Clip Path Links',
    type: 'clip-path-links',
    props: {
      className: '',
      style: {}
    }
  },
  {
    id: 'landing-page-one-1',
    name: 'ArDacity Landing Page',
    type: 'landing-page-one',
    props: {
      title: "ArDacity UI",
      subtitleLines: [
        "A collection of UI components",
        "Making Frontend Development Easier"
      ],
      description: "ArDacity UI is a collection of beautiful and functional UI components built for the Arweave ecosystem.",
      auroraColorStops: ["#3A29FF", "#FF94B4", "#FF3232"],
      pixelTransitionImgUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop",
      pixelTransitionText: "Making for AO, On AO"
    }
  },
  {
    id: 'leaderboard-1',
    name: 'AO Leaderboard',
    type: 'leaderboard',
    props: {
      processId: 'N_boXL20JQirhENJyfml_Geaa5cofYG8BieNA0uKZ6U',
      title: 'AO Leaderboard',
      limit: 10
    }
  },
  // Commenting out header components until we find a fix
  /*
  {
    id: 'ardacity-header-one-1',
    name: 'ArDacity Header One',
    type: 'ardacity-header-one',
    props: {
      name: 'Your Name',
      title: 'Your Title',
      navLinks: [
        { label: 'Home', href: '/', isActive: true },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ],
      images: [
        'https://arweave.net/your-image-1',
        'https://arweave.net/your-image-2'
      ]
    }
  },
  {
    id: 'ardacity-header-three-1',
    name: 'ArDacity Header Three',
    type: 'ardacity-header-three',
    props: {
      imageSrc: 'https://arweave.net/your-image',
      title: 'Your Title',
      grid: 10,
      mouse: 0.5,
      strength: 0.5,
      relaxation: 0.5,
      links: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]
    }
  }
  */
];

export default function Home() {
  return (
    <main className="min-h-screen">
     
          <div className="App">
     
    </div>

      <Builder availableComponents={availableComponents} />
    </main>
  );
}
