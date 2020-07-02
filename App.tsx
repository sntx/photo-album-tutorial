import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import Axios from "axios";
import {
  styled,
  useStyled,
  defaultTheme,
  ThemeProvider,
  Theme,
} from "react-native-reflect";
import { Ionicons } from "@expo/vector-icons";

import ImageGrid from "./src/ImageGrid";
import SearchTerms from "./src/SearchTerms";
import FullWidthImage from "./src/FullWidthImage";

const theme: Theme = {
  ...defaultTheme,
  colors: { lightGray: "#EAEBEE", highlight: "#E9F0FE" },
  space: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  sizes: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  radii: [0, 15, 30],
};

const COVER_IMAGE_URI =
  "https://images-assets.nasa.gov/image/0700064/0700064~medium.jpg";

// Items used by ImageGrid, contains list of images.
type Items = { links: [{ href: string }] }[];

// Data returned by HTTP request
type AxiosData = {
  collection: {
    items: Items;
  };
};

const Container = styled(View, {
  // small  screens: 2 -> theme.space[2] = 4
  // medium screens: 7 -> theme.space[7] = 64
  // medium screens: 9 -> theme.space[9] = 256
  marginRight: [2, 7, 9],
  marginLeft: [2, 7, 9],
});

// STODONEXT replace SafeAreaView by SafeAreaContext so shadows look good on iOS
//           Move Header to its own component
const Header = styled(View, {
  backgroundColor: "white",
  height: 7,
  borderWidth: 0,
  borderColor: "lightGray",
  marginBottom: 4,
  paddingLeft: 4,
  paddingRight: 5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  shadowColor: "black",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 1,
});

// marginTop: 7 = theme.space[7] = 64
const MyActivityIndicator = styled(ActivityIndicator, { marginTop: 7 });

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Items>([]);
  const [query, setQuery] = useState("");

  // Create and set search query using terms argument
  const createQuery = (terms: string) => {
    if (!terms) return setQuery("");

    const encodeTerms = terms.replace(/\s/g, "%20");
    setQuery(
      `https://images-api.nasa.gov/search?q=${encodeTerms}&media_type=image`
    );
  };

  // Get our data
  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Axios.get<AxiosData>(query)
      .then(({ data }) => {
        setData(data.collection.items);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [query]);

  // Responsive values
  const { attrs, styles } = useStyled({
    styles: {
      // small  screens: 2 -> theme.space[2] = 4
      // medium screens: 3 -> theme.space[7] = 8
      // medium screens: 4 -> theme.space[9] = 16
      gridGap: { margin: [2, 3, 4] },
    },
    attrs: {
      // 1 on small screens, 3 on medium screens, 4 on large screens
      numColumns: [1, 3, 4],
      // 4/3 on small screens, 1 on medium and large screens
      imageAspectRatio: [4 / 3, 1],
      // only show cover image on small screens
      displayHomeImg: [false, true],
    },
  });

  return (
    <ThemeProvider value={theme}>
      <SafeAreaView>
        <Header>
          <Ionicons name="md-planet" size={32} color="black" />
          <Ionicons name="md-menu" size={32} color="black" />
        </Header>
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
}
