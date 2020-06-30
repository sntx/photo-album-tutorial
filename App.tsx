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

const theme: Theme = {
  ...defaultTheme,
  colors: { lightGray: "#EAEBEE", highlight: "#E9F0FE" },
  space: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  sizes: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  radii: [0, 15, 30],
};

import ImageGrid from "./src/ImageGrid";
import SearchTerms from "./src/SearchTerms";

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

// marginTop: 7 = theme.space[7] = 64
const MyActivityIndicator = styled(ActivityIndicator, { marginTop: 7 });

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Items>([]);
  const [query, setQuery] = useState("");

  // Create and set query based on terms
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
  const { attrs } = useStyled({
    attrs: {
      // 1 on small screens, 3 on medium screens, 4 on large screens
      numColumns: [1, 3, 4],
      // 4/3 on small screens, 1 on medium and large screens
      imageAspectRatio: [4 / 3, 1],
      // 5 on small screens, 10 on medium screens, 20 on large screens
      // STODO get these values from theme theme.space[2], theme.space[3] and
      // theme.space[4] or get these values from styles : grid : { margin : [2,3,4] }
      gridGap: [5, 10, 20],
    },
  });

  // After loading is done "isLoading", we render our images using <ImageGrid/>
  return (
    <ThemeProvider value={theme}>
      <SafeAreaView>
        <Container>
          <SearchTerms onChange={createQuery} />
          {isLoading ? (
            <MyActivityIndicator />
          ) : (
            <ImageGrid
              data={data}
              numColumns={attrs.numColumns}
              aspectRatio={attrs.imageAspectRatio}
              gridGap={attrs.gridGap}
            />
          )}
        </Container>
      </SafeAreaView>
    </ThemeProvider>
  );
}
