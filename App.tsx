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
  colors: { gray0: "#EAEBEE", primary0: "#E9F0FE" },
  space: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  sizes: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  radii: [0, 15, 30],
};

console.log("defaultTheme", defaultTheme);

import ImageGrid from "./src/ImageGrid";
import CategoriesBar from "./src/CategoriesBar";

// Items used by ImageGrid, contains list of images.
type Items = { links: [{ href: string }] }[];

// Data returned by HTTP request
type AxiosData = {
  collection: {
    items: Items;
  };
};

const GET_GALAXY_IMAGES =
  "https://images-api.nasa.gov/search?q=spiral%20galaxies&media_type=image";

const Container = styled(View, {
  marginRight: [0, 7, 9],
  marginLeft: [0, 7, 9],
});

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Items>([]);

  // Get our data
  useEffect(() => {
    Axios.get<AxiosData>(GET_GALAXY_IMAGES)
      .then(({ data }) => {
        setData(data.collection.items);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // Responsive values
  const { attrs } = useStyled({
    attrs: {
      // 1 on small screens, 3 on medium screens, 4 on large screens
      numColumns: [1, 3, 4],
      // 4/3 on small screens, 1 on medium and large screens
      imageAspectRatio: [4 / 3, 1],
      // 5 on small screens, 10 on medium screens, 20 on large screens
      gridGap: [5, 10, 20],
    },
  });

  // After loading is done "isLoading", we render our images using <ImageGrid/>
  return (
    <ThemeProvider value={theme}>
      <SafeAreaView>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Container>
            <CategoriesBar />
            <ImageGrid
              data={data}
              numColumns={attrs.numColumns}
              aspectRatio={attrs.imageAspectRatio}
              gridGap={attrs.gridGap}
            />
          </Container>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}
