import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import Axios from "axios";
import {
  styled,
  useStyled,
  defaultTheme,
  ThemeProvider,
  Theme,
} from "react-native-reflect";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  // medium screens: 8 -> theme.space[9] = 128
  marginRight: [2, 7, 8],
  marginLeft: [2, 7, 8],
});

const NavBar = ({ children }) => {
  const insets = useSafeAreaInsets();

  const Bar = styled(View, {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    // theme.sizes[7] = 64
    height: 7,
    // theme.borderWidths[0] = 1
    borderWidth: 0,
    // since theme.borderWidths[0] is 1, we can use "px" suffix to ignore the
    // theme. "0px" gets gets converted to 0 (number)
    borderTopWidth: "0px",
    // theme.colors["lightGray"] = "#EAEBEE"
    borderColor: "lightGray",
    paddingLeft: 4,
    paddingRight: 5,
  });

  const Wrap = styled(View, {
    // smaller screens: theme.space[2] = 4
    // larger  screens: theme.space[4] = 16
    marginBottom: [1, 4],
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: [0.2, 0.3],
    shadowRadius: [3, 10],
    backgroundColor: "white",
    elevation: [0.2, 0.8],
  });

  return (
    <Wrap>
      <View style={{ height: insets.top }} />
      <Bar>{children}</Bar>
    </Wrap>
  );
};

const SearchTermsWrap = styled(View, {
  paddingBottom: [0, 4],
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
      <SafeAreaProvider>
        <NavBar>
          <Ionicons name="md-planet" size={32} color="black" />
          <Ionicons name="md-menu" size={32} color="black" />
        </NavBar>
        <Container>
          <SearchTermsWrap>
            <SearchTerms onChange={createQuery} />
          </SearchTermsWrap>
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
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
