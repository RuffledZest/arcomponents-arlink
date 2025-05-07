import { BuilderAOSpawner } from './AOSpawner';
import { BuilderPermawebAtomicAsset } from './PermawebAtomicAsset';
import BuilderSmoothScrollHero from './SmoothScrollHero';
import BuilderDropdownNavbar from './DropdownNavbar';
import { BuilderClipPathLinks } from './ClipPathLinks';
import BuilderLandingPageOne from './LandingPageOne';

export const builderComponents = {
  'permaweb-atomic-asset': {
    name: 'Permaweb Atomic Asset',
    component: BuilderPermawebAtomicAsset,
    category: 'Permaweb',
    icon: '🔗',
    defaultProps: {
      assetId: '',
      assetIds: [],
      luaCode: '',
      processId: ''
    }
  },
  'ao-spawner': {
    name: 'AO Process Spawner',
    category: 'AO',
    icon: '🚀',
    component: BuilderAOSpawner,
    defaultProps: {
      luaCode: `-- Default Lua code for process spawning
local process = ao.spawn({
  name = "Test Process",
  tags = {
    { name = "Type", value = "Test" }
  }
})

if process.error then
  error(process.error)
end

-- Test the process
local result = ao.send(process.id, {
  Target = process.id,
  Action = "Test"
})

if result.error then
  error(result.error)
end

return process`
    }
  },
  'smooth-scroll-hero': {
    name: 'Smooth Scroll Hero',
    category: 'Hero',
    icon: '🌌',
    component: BuilderSmoothScrollHero,
    defaultProps: {
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
  'dropdown-navbar': {
    name: 'Dropdown Navbar',
    category: 'Navigation',
    icon: 'nav',
    component: BuilderDropdownNavbar,
    props: {},
  },
  'clip-path-links': {
    name: 'Clip Path Links',
    category: 'Social',
    icon: '🔗',
    component: BuilderClipPathLinks,
    defaultProps: {
      className: '',
      style: {},
      links: [
        { icon: 'SiGoogle', href: '#', label: 'Google' },
        { icon: 'SiShopify', href: '#', label: 'Shopify' },
        { icon: 'SiApple', href: '#', label: 'Apple' },
        { icon: 'SiSoundcloud', href: '#', label: 'Soundcloud' },
        { icon: 'SiAdobe', href: '#', label: 'Adobe' },
        { icon: 'SiFacebook', href: '#', label: 'Facebook' },
        { icon: 'SiTiktok', href: '#', label: 'TikTok' },
        { icon: 'SiSpotify', href: '#', label: 'Spotify' },
        { icon: 'SiLinkedin', href: '#', label: 'LinkedIn' }
      ],
      gridLayout: '3x3',
      customGrid: '',
      iconSize: 'md',
      hoverColor: '#1a1a1a',
      backgroundColor: 'transparent',
      borderColor: '#1a1a1a',
      animationDuration: 0.3
    }
  },
  'landing-page-one': {
    name: 'ArDacity Landing Page',
    category: 'Landing',
    icon: '🎨',
    component: BuilderLandingPageOne,
    defaultProps: {
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
  }
}; 