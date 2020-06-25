import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  SafeAreaView,
  Image,
  LayoutChangeEvent,
} from "react-native";
import Axios from "axios";
import { useStyled, styled } from "react-native-reflect";

// Items used by FlatList, contains list of images.
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
  padding: 2,
});

const ImageContainer = styled(View, {
  marginRight: 3,
});

const MyImage = ({ width, height, uri }) => {
  const { style } = useStyled({
    style: {
      // STODONEXT subtract padding or margin from <Image> width and height
      // so all images are square
    },
  });
};

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Items>([]);
  const [flatListWidth, setFlatListWidth] = useState(0);

  // Here we are calling Axios.get() inside React's useEffect hook. We need to
  // get our async data like this so our component can properly update it's
  // state.
  //
  // For useEffect() to be called only once, we add an empty array as the second
  // argument of useEffect()
  //
  // More on useEffect(): https://reactjs.org/docs/hooks-effect.html
  //
  useEffect(() => {
    Axios.get<AxiosData>(GET_GALAXY_IMAGES)
      .then(({ data }) => {
        console.log("data.collection.items", data.collection.items);
        setData(data.collection.items);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const { attrs } = useStyled({
    attrs: {
      numColumns: [1, 3, 4],
      imageAspectRatio: [4 / 3, 1],
    },
  });

  const imageWidth = flatListWidth / attrs.numColumns;
  const imageHeight = imageWidth / attrs.imageAspectRatio;

  const onLayout = (obj: LayoutChangeEvent) => {
    const width = obj.nativeEvent.layout.width;
    if (width === flatListWidth) return;

    setFlatListWidth(width);
  };

  // After loading is done "isLoading", we render a FlatList with the data that
  // was set on the success axios callback above "setData(...)"
  //
  // Finally we render each of our images inside FlatList's renderImage prop
  return (
    <SafeAreaView>
      <Container>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            numColumns={attrs.numColumns}
            // NOTE: we need to change FlatList's key to be able to change
            // numColumns on the fly. This is a React Native specification.
            key={attrs.numColumns}
            onLayout={onLayout}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <ImageContainer>
                <Image
                  style={{ width: imageWidth, height: imageHeight }}
                  source={{ uri: item.links[0].href }}
                />
              </ImageContainer>
            )}
          />
        )}
      </Container>
    </SafeAreaView>
  );
}
