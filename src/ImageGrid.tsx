import React, { useState } from "react";
import { FlatList, Image, LayoutChangeEvent } from "react-native";

type ImageGridProps = {
  data: any;
  numColumns: number;
  aspectRatio: number;
  gridGap: number;
};

type RenderItemProps = {
  item: { links: [{ href: string }] };
  index: number;
};

export default function ImageGrid({
  data,
  numColumns = 3,
  aspectRatio = 1,
  gridGap = 0,
}: ImageGridProps) {
  const [flatListWidth, setFlatListWidth] = useState(0);

  // width of all vertical gridGaps in a row
  const gridGaps = gridGap * (numColumns - 1);
  const imageWidth = (flatListWidth - gridGaps) / numColumns;
  const imageHeight = imageWidth / aspectRatio;

  const onLayout = (obj: LayoutChangeEvent) => {
    const width = obj.nativeEvent.layout.width;
    if (width === flatListWidth) return;

    setFlatListWidth(width);
  };

  const renderItem = ({ item, index }: RenderItemProps) => {
    const isLastImageInRow = (index + 1) % numColumns === 0;
    const marginRight = isLastImageInRow ? 0 : gridGap;
    const marginBottom = gridGap;

    return (
      <Image
        style={{
          width: imageWidth,
          height: imageHeight,
          marginRight,
          marginBottom,
        }}
        source={{ uri: item.links[0].href }}
      />
    );
  };

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      // NOTE: we need to change FlatList's key to be able to change
      // numColumns on the fly. This is a React Native specification.
      key={numColumns}
      onLayout={onLayout}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
}
