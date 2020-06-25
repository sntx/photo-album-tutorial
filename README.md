# Building a Responsive React Native Photo Album for Mobile and Web

## Description

The following tutorial will explain step by step how to create a responsive photo album with React Native and Typescript. After finishing the tutorial you will learn how to:

- Create a universal React Native app that runs on iOS, Android and Web
- Create a responsive UI and look for different screen sizes

## Getting Started

### Create a new Expo app

(NOTE: this tutorial is using expo-cli@3.21.10) and choose "blank (TypeScript)" option when asked.

```bash
expo init photo-album-tutorial
# ? Choose a template: expo-template-blank-typescript

cd photo-album-tutorial
yarn start
# Run Expo app on web and iOS (or Android). I'll be using iOS for this
# tutorial, but if you prefer, you can follow along using Android instead.
#
# Press 'w' to open web app
# Press 'i' to open iOS app (or 'a' for Android)
```

## Get some galactic photos!

We'll use [axios](https://github.com/axios/axios) for making HTTP requests and getting images from [NASA's public API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)

```bash
yarn add axios
```

Replace the contents of `App.tsx` with the following and follow the comments in the code for an explanation of what we're doing.

```typescript
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Image } from "react-native";
import Axios from "axios";

const GET_GALAXY_IMAGES =
  "https://images-api.nasa.gov/search?q=spiral%20galaxies&media_type=image";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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
    Axios.get(GET_GALAXY_IMAGES)
      .then(({ data }) => {
        console.log("data.collection.itmes", data.collection.items);
        setData(data.collection.items);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // After loading is done "isLoading", we render a FlatList with the data that
  // was set on the success axios callback above "setData(...)"
  //
  // Finally we render each of our images inside FlatList's renderImage prop
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              style={{ height: 100, width: 100 }}
              source={{ uri: item.links[0].href }}
            />
          )}
        />
      )}
    </View>
  );
}
```
