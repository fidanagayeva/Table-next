"use client";
import React from "react";
import { SWRConfig } from "swr";
import { SWRconfig } from "./swr/config";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={SWRconfig}>{children}</SWRConfig>;
};
