import React, { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import Axios from "axios";
import { useStyled } from "react-native-reflect";

import ImageGrid from "./src/ImageGrid";

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

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Items>([]);

  // Here we are calling Axios.get() inside React's useEffect hook. We need to
  // get our async data like this so our component can properly update it's
  // state.
  //
  // For useEffect() to be called only once, we add an empty array as its
  // second argument.
  //
  // More on useEffect(): https://reactjs.org/docs/hooks-effect.html
  //
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
    },
  });

  // After loading is done "isLoading", we render a FlatList with the data that
  // was set on the success axios callback above "setData(...)"
  //
  // Finally we render each of our images inside FlatList's renderImage prop
  return (
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ImageGrid
          data={data}
          numColumns={attrs.numColumns}
          aspectRatio={attrs.imageAspectRatio}
          gridGap={20}
        />
      )}
    </SafeAreaView>
  );
}
