import React from "react";
import dynamic from "next/dynamic";

import { App } from "../src/App";

export default function Page() {
  const Component = dynamic(
    () => {
      return Promise.resolve(App);
    },
    { ssr: false }
  );

  return <Component />;
}
