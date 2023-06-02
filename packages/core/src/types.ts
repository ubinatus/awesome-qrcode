export type QRStyle = "squares" | "dots";
export type ECLevel = "L" | "M" | "Q" | "H";
export type EyeColor = string | InnerOuterEyeColor;
export type InnerOuterEyeColor = {
  inner: string;
  outer: string;
};

export type CornerRadii =
  | number
  | [number, number, number, number]
  | InnerOuterRadii;

export type InnerOuterRadii = {
  inner: number | [number, number, number, number];
  outer: number | [number, number, number, number];
};

export interface DefaultOptions {
  value: string;
  ecLevel: string;
  enableCORS: boolean;
  size: number;
  quietZone: number;
  bgColor: string;
  fgColor: string;
  logoOpacity: number;
  qrStyle: string;
  eyeRadius: CornerRadii | [CornerRadii, CornerRadii, CornerRadii];
  logoPaddingStyle: string;
  logoWidth: number;
  logoHeight: number;
  logoPadding: number;
}

export interface Props {
  value?: string;
  size?: number;
  ecLevel?: ECLevel;
  enableCORS?: boolean;
  quietZone?: number;
  bgColor?: string;
  fgColor?: string;
  logoImage?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoOpacity?: number;
  logoOnLoad?: () => void;
  removeQrCodeBehindLogo?: boolean;
  logoPadding?: number;
  logoPaddingStyle?: "square" | "circle";
  eyeRadius?: CornerRadii | [CornerRadii, CornerRadii, CornerRadii];
  eyeColor?: EyeColor | [EyeColor, EyeColor, EyeColor];
  qrStyle?: QRStyle;
}

export type Options = DefaultOptions &
  Pick<
    Props,
    "logoImage" | "logoOnLoad" | "removeQrCodeBehindLogo" | "eyeColor"
  >;

export type Coordinates = {
  row: number;
  col: number;
};
