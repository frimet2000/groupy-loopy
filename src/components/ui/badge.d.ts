import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps>;

