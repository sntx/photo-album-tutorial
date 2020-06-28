import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

import { styled } from "react-native-reflect";

import searchTerms from "./searchTerms";

const QueryButton = ({ title, onPress, active = false }) => {
  const StyledTouchable = styled(TouchableOpacity, {
    padding: 5,
    marginRight: 2,
    borderRadius: 2,
    borderWidth: 0,
    borderColor: "gray0",
    backgroundColor: active ? "primary0" : undefined,
  });

  return (
    <StyledTouchable onPress={onPress}>
      <Text>{title}</Text>
    </StyledTouchable>
  );
};

const QueryContainer = styled(
  FlatList,
  { marginBottom: 5, marginTop: 5 },
  { horizontal: true }
);

const getData = (selected?: number) => {
  if (selected == null) return searchTerms;

  const term = searchTerms[selected];

  return [{ name: term.name }, ...term.categories];
};

export default function CategoriesBar({}) {
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(getData()); // STODO

  // [0, 2] => Galaxies, Barrel Spiral

  const onPress = (index) => {
    console.log("onPress", index, selected);
    if (selected.length === 0) return setSelected([index]);

    if (selected.length > 0 && index === 0) return setSelected([]);

    if (selected.length === 2 && index === selected[1])
      return setSelected([selected[0]]);

    setSelected([selected[0], index]);

    // STODONEXT setData() using selected and set active to Buttons
  };

  console.log("selected", selected);

  const renderItem = ({ item, index }) => {
    return (
      <QueryButton
        onPress={() => onPress(index)}
        title={item.name}
      ></QueryButton>
    );
  };

  return (
    <View>
      <QueryContainer data={data} renderItem={renderItem} />
    </View>
  );
}
