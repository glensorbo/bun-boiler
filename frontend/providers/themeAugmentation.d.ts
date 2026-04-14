import type {} from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      sunken: string;
      raised: string;
      overlay: string;
    };
    border: {
      subtle: string;
      strong: string;
    };
    sidebar: {
      background: string;
      foreground: string;
      muted: string;
      accent: string;
    };
    gradient: {
      hero: string;
      accent: string;
    };
    chart: string[];
  }

  interface PaletteOptions {
    surface?: {
      sunken: string;
      raised: string;
      overlay: string;
    };
    border?: {
      subtle: string;
      strong: string;
    };
    sidebar?: {
      background: string;
      foreground: string;
      muted: string;
      accent: string;
    };
    gradient?: {
      hero: string;
      accent: string;
    };
    chart?: string[];
  }
}

export {};
