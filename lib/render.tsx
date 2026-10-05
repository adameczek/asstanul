import { Fragment, type ReactNode } from "react";

export function bold(text: string): ReactNode {
  return text.split("**").map((part, i) =>
    part === "" ? null : i % 2 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
