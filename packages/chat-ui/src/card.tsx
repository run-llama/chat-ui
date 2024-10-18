import { type ReactNode } from "react";

export function Card({ children }: { children: ReactNode }): JSX.Element {
  return <div className="bg-black p-2 text-white rounded-lg">{children}</div>;
}
