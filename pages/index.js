import React from "react";
import dynamic from "next/dynamic";

import { IndexPage } from "../src/pages/IndexPage";

export default function Page() {
  const Component = dynamic(
    () => {
      return Promise.resolve(IndexPage);
    },
    { ssr: false }
  );

  return <Component />;
}
