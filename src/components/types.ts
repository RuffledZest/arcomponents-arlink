/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Component {
  id: string;
  type: string;
  props: {
    [key: string]: any;
  };
}

export interface BuilderComponent {
  name: string;
  category: string;
  icon: string;
  component: React.FC<BuilderComponentProps>;
  defaultProps: {
    [key: string]: any;
  };
}

export interface BuilderComponentProps {
  component: Component;
  onPropertyChange: (property: string, value: any) => void;
}

export interface SmoothScrollHeroProps {
  backgroundImage?: string;
  parallaxImages?: {
    src: string;
    alt: string;
    start: number;
    end: number;
    className: string;
  }[];
  scheduleItems?: {
    title: string;
    date: string;
    location: string;
  }[];
}

export interface AOSpawnerProps {
  luaCode?: string;
  onProcessCreated?: (processId: string) => void;
} 