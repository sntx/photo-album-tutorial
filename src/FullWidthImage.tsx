import React, { useState } from "react";
import { View, Image, LayoutChangeEvent } from "react-native";

type FullWidthImageProps = { uri: string; aspectRatio: number };

/**
 * Renders full width image by inferring its width from the Image's parent
 * component and its height using an aspect ratio value.
 */
export default function FullWidthImage({
  uri,
  aspectRatio = 1,
}: FullWidthImageProps) {
  const [width, setWidth] = useState(0);

  // set Image's width to the width of its parent component
  const onLayout = (obj: LayoutChangeEvent) =>
    setWidth(obj.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout}>
      <Image style={{ width, height: width / aspectRatio }} source={{ uri }} />
    </View>
  );
}
