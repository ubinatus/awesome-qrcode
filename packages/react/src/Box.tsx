import * as React from "react";

type HTMLProperties = Omit<
  React.AllHTMLAttributes<HTMLElement>,
  "as" | "className" | "color" | "height" | "width"
>;

type Props = HTMLProperties & {
  as?: React.ElementType;
  className?: string;
  testId?: string;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  borderRadius?: React.CSSProperties["borderRadius"];
  borderColor?: React.CSSProperties["borderColor"];
  borderStyle?: React.CSSProperties["borderStyle"];
  borderWidth?: React.CSSProperties["borderWidth"];
  boxShadow?: React.CSSProperties["boxShadow"];
  overflow?: React.CSSProperties["overflow"];
  position?: React.CSSProperties["position"];
  padding?: React.CSSProperties["padding"];
  display?: React.CSSProperties["display"];
  justifyContent?: React.CSSProperties["justifyContent"];
  userSelect?: React.CSSProperties["userSelect"];
};

export const Box = React.forwardRef<HTMLElement, Props>(
  (
    {
      as = "div",
      className,
      testId,
      style,
      width,
      height,
      borderRadius,
      borderColor,
      borderStyle,
      borderWidth,
      boxShadow,
      overflow,
      position,
      padding,
      display,
      justifyContent,
      userSelect,
      ...props
    }: Props,
    ref,
  ) => {
    const nativeProps: Record<string, unknown> = {};

    for (const key in props) {
      nativeProps[key] = props[key as keyof typeof props];
    }

    return React.createElement(as, {
      className,
      ...nativeProps,
      style: {
        width,
        height,
        borderRadius,
        borderColor,
        borderStyle,
        borderWidth,
        boxShadow,
        overflow,
        position,
        padding,
        display,
        justifyContent,
        userSelect,
        ...style,
      },
      "data-testid": testId ? `rk-${testId.replace(/^rk-/, "")}` : undefined,
      ref,
    });
  },
);

export type BoxProps = Parameters<typeof Box>[0];

Box.displayName = "Box";
