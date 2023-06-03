/**
 * Represents the style of the QR code data
 */
export type DataStyle = "squares" | "dots";

/**
 * Represents the style of the logo radius
 */
export type LogoRadiusStyle = "square" | "circle";

/**
 * Represents the error correction level of the QR code.
 * Higher levels offer a better error resistance but reduce the symbol's capacity to be scanned.
 */
export type ECLevel = "L" | "M" | "Q" | "H";

/**
 * Represents a color configuration for an eye pattern.
 * Can be a simple color (string) or a detailed configuration (InnerOuterColor).
 */
export type EyeColor = string | InnerOuterColor;

/**
 * Provides detailed color configuration for an eye pattern.
 */
export type InnerOuterColor = {
  /** Inner color of the eye pattern. */
  inner: string;

  /** Outer color of the eye pattern. */
  outer: string;
};

/**
 * Represents corner radii configuration for the position patterns.
 * Can be a single radius (number) or a detailed configuration (InnerOuterRadius).
 */
export type EyeRadius = number | InnerOuterRadius;

/**
 * Provides detailed radius configuration for an eye pattern.
 */
export type InnerOuterRadius = {
  /** Inner radii of the pattern corners. */
  inner: number;

  /** Outer radii of the pattern corners. */
  outer: number;
};

export type DefaultOptions = Required<
  Pick<
    Props,
    | "value"
    | "size"
    | "dataStyle"
    | "ecLevel"
    | "quietZone"
    | "bgColor"
    | "fgColor"
    | "logoImage"
    | "logoWidth"
    | "logoHeight"
    | "logoOpacity"
    | "logoRadiusStyle"
    | "logoPadding"
    | "eyeRadius"
  >
>;

export interface Props {
  /**
   * The data to be encoded in the QR code.
   */
  value?: string;

  /**
   * The size of the QR code in pixels.
   */
  size?: number;

  /**
   * The style of the QR code data modules.
   */
  dataStyle?: DataStyle;

  /**
   * The error correction level of the QR code.
   */
  ecLevel?: ECLevel;

  /**
   * The size of the quiet zone around the QR code in pixels.
   */
  quietZone?: number;

  /**
   * The background color of the QR code.
   */
  bgColor?: string;

  /**
   * The color of the QR code modules.
   */
  fgColor?: string;

  /**
   * The URL of the image to be displayed in the center of the QR code.
   */
  logoImage?: string;

  /**
   * The width of the logo in pixels.
   */
  logoWidth?: number;

  /**
   * The height of the logo in pixels.
   */
  logoHeight?: number;

  /**
   * The opacity of the logo. Ranges from 0 to 1.
   */
  logoOpacity?: number;

  /**
   * The padding around the logo in pixels.
   */
  logoPadding?: number;

  /**
   * The shape of the padding around the logo.
   */
  logoRadiusStyle?: LogoRadiusStyle;

  /**
   * Whether to remove the QR code modules behind the logo.
   */
  removeQrCodeBehindLogo?: boolean;

  /**
   * The radius of the corners of the positioning eyes in pixels.
   */
  eyeRadius?: EyeRadius;

  /**
   * The color of the positioning eyes.
   */
  eyeColor?: EyeColor;

  /**
   * The function to be called when the QR code has loaded.
   */
  onLoad?: () => void;

  /**
   * The function to be called if there was an error loading the QR code.
   */
  onError?: (err: string) => void;
}

export type Options = DefaultOptions &
  Pick<
    Props,
    "logoImage" | "removeQrCodeBehindLogo" | "eyeColor" | "onLoad" | "onError"
  >;

export type Coordinates = {
  row: number;
  col: number;
};
