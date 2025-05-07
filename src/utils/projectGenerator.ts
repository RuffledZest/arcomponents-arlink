import { Component } from '@/types/builder';
import JSZip from 'jszip';

interface ProjectFile {
  path: string;
  content: string;
}

export const generateProjectFiles = (components: Component[]): ProjectFile[] => {
  const files: ProjectFile[] = [];

  // Generate package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: 'my-website',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '14.1.0',
        react: '18.2.0',
        'react-dom': '18.2.0',
        'framer-motion': '11.0.3',
        gsap: '3.12.5',
        three: '0.161.0',
        '@types/node': '20.11.16',
        '@types/react': '18.2.52',
        '@types/react-dom': '18.2.18',
        typescript: '5.3.3',
        tailwindcss: '3.4.1',
        postcss: '8.4.33',
        autoprefixer: '10.4.17',
        jszip: '3.10.1'
      }
    }, null, 2)
  });

  // Generate tsconfig.json
  files.push({
    path: 'tsconfig.json',
    content: JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next'
          }
        ],
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2)
  });

  // Generate tailwind.config.js
  files.push({
    path: 'tailwind.config.js',
    content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
  });

  // Generate postcss.config.js
  files.push({
    path: 'postcss.config.js',
    content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
  });

  // Generate next.config.js
  files.push({
    path: 'next.config.js',
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`
  });

  // Generate README.md
  files.push({
    path: 'README.md',
    content: `# My Website

This is a Next.js project generated using the website builder.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- \`src/app/\`: Contains the main application pages
- \`src/components/\`: Contains all the components used in the website
- \`src/styles/\`: Contains global styles and Tailwind CSS configuration
- \`public/\`: Contains static assets like images and fonts

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.`
  });

  // Generate .gitignore
  files.push({
    path: '.gitignore',
    content: `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`
  });

  // Generate src/app/layout.tsx
  files.push({
    path: 'src/app/layout.tsx',
    content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Website',
  description: 'Generated using the website builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
  });

  // Generate src/app/globals.css
  files.push({
    path: 'src/app/globals.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;`
  });

  // Generate src/app/page.tsx
  files.push({
    path: 'src/app/page.tsx',
    content: `'use client';

import { Builder } from '@/components/Builder';
import { Component } from '@/types/builder';

const availableComponents: Component[] = ${JSON.stringify(components, null, 2)};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Builder availableComponents={availableComponents} />
    </main>
  );
}`
  });

  // Generate component files
  components.forEach(component => {
    const componentName = component.type;
    const componentPath = `src/components/${componentName}.tsx`;
    
    // Skip if component file already exists
    if (files.some(file => file.path === componentPath)) return;

    // Generate component file
    files.push({
      path: componentPath,
      content: `import React from 'react';

export interface ${componentName}Props {
  ${Object.entries(component.props)
    .map(([key, value]) => `${key}: ${typeof value};`)
    .join('\n  ')}
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};

export default ${componentName};`
    });
  });

  return files;
};

export const downloadProject = (components: Component[]) => {
  const files = generateProjectFiles(components);
  
  // Create a zip file
  const zip = new JSZip();
  
  // Add files to zip
  files.forEach(file => {
    zip.file(file.path, file.content);
  });
  
  // Generate zip file
  zip.generateAsync({ type: 'blob' })
    .then((content: Blob) => {
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'my-website.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}; 