import React from "react";
import dynamic from "next/dynamic";

import { MainScreen } from "../src/screens/MainScreen";

export default function Page() {
  const Component = dynamic(
    () => {
      return Promise.resolve(MainScreen);
    },
    { ssr: false }
  );

  return <Component />;
}
