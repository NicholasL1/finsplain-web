"use client";

import React, { useState } from "react";

interface UrlProviderProps {
  children: React.ReactNode;
}

export function UrlProvider({ children }: UrlProviderProps) {
  const [currentUrl] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  // Clone children and add the currentUrl as a hidden input
  const childrenWithUrl = React.Children.map(children, (child) => {
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === 'form') {
      return React.cloneElement(child, {}, [
        ...React.Children.toArray(child.props.children),
        <input key="site-url-input" type="hidden" name="site_url" value={currentUrl} />
      ]);
    }
    return child;
  });

  return <>{childrenWithUrl}</>;
} 