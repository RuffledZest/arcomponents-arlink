/* eslint-disable @typescript-eslint/no-unused-vars */
// import { ReactLenis } from "@studio-freight/lenis";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { SiSpacex } from "react-icons/si";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useRef, useMemo } from "react";
import { SmoothScrollHeroProps } from './types';

// Calculate section height based on viewport
const getSectionHeight = () => {
  if (typeof window !== 'undefined') {
    return window.innerHeight * 2;
  }
  return 1500;
};

const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  backgroundImage = "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parallaxImages = [
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
  scheduleItems = [
    { title: "NG-21", date: "Dec 9th", location: "Florida" },
    { title: "Starlink", date: "Dec 20th", location: "Texas" },
    { title: "Starlink", date: "Jan 13th", location: "Florida" },
    { title: "Turksat 6A", date: "Feb 22nd", location: "Florida" },
    { title: "NROL-186", date: "Mar 1st", location: "California" },
    { title: "GOES-U", date: "Mar 8th", location: "California" },
    { title: "ASTRA 1P", date: "Apr 8th", location: "Texas" }
  ]
}) => {
  const sectionHeight = useMemo(() => getSectionHeight(), []);

  return (
    <div className="bg-zinc-950">
      {/* <ReactLenis
        root
        options={{
          lerp: 0.1, // Increased for better performance
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1,
          smoothTouch: false, // Disable smooth scrolling on touch devices
        }}
      > */}
        {/* <Nav /> */}
        <Hero backgroundImage={backgroundImage} parallaxImages={parallaxImages} sectionHeight={sectionHeight} />
        <Schedule scheduleItems={scheduleItems} />
      {/* </ReactLenis> */}
    </div>
  );
};

// const Nav = () => {
//   return (
//     <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white">
//       <SiSpacex className="text-3xl mix-blend-difference" />
//       <button
//         onClick={() => {
//           document.getElementById("launch-schedule")?.scrollIntoView({
//             behavior: "smooth",
//           });
//         }}
//         className="flex items-center gap-1 text-xs text-zinc-400"
//       >
//         LAUNCH SCHEDULE <FiArrowRight />
//       </button>
//     </nav>
//   );
// };

interface HeroProps {
  backgroundImage: string;
  parallaxImages: SmoothScrollHeroProps['parallaxImages'];
  sectionHeight: number;
}

const Hero: React.FC<HeroProps> = ({ backgroundImage, parallaxImages, sectionHeight }) => {
  return (
    <div
      style={{ height: `calc(${sectionHeight}px + 100vh)` }}
      className="relative w-full"
    >
      <h1 
      className="absolute top-0 left-0 right-0 z-10 mx-auto max-w-5xl px-4 pt-[200px] text-center text-8xl font-black uppercase text-zinc-50"
      >ArDacity NFT</h1>
      <CenterImage backgroundImage={backgroundImage} sectionHeight={sectionHeight} />
      <ParallaxImages images={parallaxImages} sectionHeight={sectionHeight} />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

interface CenterImageProps {
  backgroundImage: string;
  sectionHeight: number;
}

const CenterImage: React.FC<CenterImageProps> = ({ backgroundImage, sectionHeight }) => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, sectionHeight], [25, 0]);
  const clip2 = useTransform(scrollY, [0, sectionHeight], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, sectionHeight + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [sectionHeight, sectionHeight + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

interface ParallaxImagesProps {
  images: SmoothScrollHeroProps['parallaxImages'];
  sectionHeight: number;
}

const ParallaxImages: React.FC<ParallaxImagesProps> = ({ images, sectionHeight }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      {images?.map((image, index) => (
        <ParallaxImg key={index} {...image} sectionHeight={sectionHeight} />
      ))}
    </div>
  );
};

interface ParallaxImgProps {
  src: string;
  alt: string;
  start: number;
  end: number;
  className: string;
  sectionHeight: number;
}

const ParallaxImg: React.FC<ParallaxImgProps> = ({ className, alt, src, start, end, sectionHeight }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
      loading="lazy" // Add lazy loading for better performance
    />
  );
};

interface ScheduleProps {
  scheduleItems: SmoothScrollHeroProps['scheduleItems'];
}

const Schedule: React.FC<ScheduleProps> = ({ scheduleItems }) => {
  return (
    <section
      id="launch-schedule"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Browse NFTs
      </motion.h1>
      {scheduleItems?.map((item, index) => (
        <ScheduleItem key={index} {...item} />
      ))}
    </section>
  );
};

interface ScheduleItemProps {
  title: string;
  date: string;
  location: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ title, date, location }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};

export default SmoothScrollHero; 