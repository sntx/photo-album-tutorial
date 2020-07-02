## Conditional Content

When there is no search selected, our UI looks quite empty on larger screens. Let's add a fixed full size image below the search buttons only on larger screens. On smaller screens we won't show the fixed image since the buttons are taking most of the screen space.

React Native Images require explicit width and height values. To take care of this, we'll create a new component (`FullWidthImage`) for rendering our full width image. `FullWidthImage` will determine it's width from it's parent component and it's height by dividing its width by an aspect ratio value.

### `src/FullWidthImage.tsx`:

```typescript
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
```

Now, add the following lines to `App.tsx`, to use the new component we created and to add the logic to display our full width image only on larger screens.

```typescript
import FullWidthImage from "./src/FullWidthImage";
```

```typescript
const COVER_IMAGE_URI =
  "https://images-assets.nasa.gov/image/0700064/0700064~medium.jpg";
```

We can very easily create conditional rendered components using Reflect responsive attrs. Below, add `attrs.displayHomeImg: [false, true]` which will be `false` on smaller screens and `true` on larger screens.

```typescript
  const { attrs, styles } = useStyled({
    ...
    attrs: {
      ...
      // only show cover image on small screens
      displayHomeImg: [false, true],
    },
  });
```

Then, let's use our newly created `attrs.displayHomeImg` value on our App's `render()` method.

```typescript
return (
  <ThemeProvider value={theme}>
    <SafeAreaView>
      <Container>
        <SearchTerms onChange={createQuery} />
        {(() => {
          if (isLoading) return <MyActivityIndicator />;

          // display cover image only on larger screens when there is no
          // other data to display
          if (data.length === 0 && attrs.displayHomeImg)
            return (
              <FullWidthImage aspectRatio={16 / 9} uri={COVER_IMAGE_URI} />
            );

          return (
            <ImageGrid
              data={data}
              numColumns={attrs.numColumns}
              aspectRatio={attrs.imageAspectRatio}
              gridGap={styles.gridGap.margin as number}
            />
          );
        })()}
      </Container>
    </SafeAreaView>
  </ThemeProvider>
);
```

Your App should look like this:

![Screens 08](./screenshots/screens-08.jpg)

## Final Touches

Let's add a header with a logo and some other elements:
