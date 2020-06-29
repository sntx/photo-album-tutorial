import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Text, View, TouchableOpacity } from "react-native";

import { styled } from "react-native-reflect";

import searchTerms from "./searchTerms";

const QueryButton = ({ title, onPress, active = false }) => {
  const Styled = styled(TouchableOpacity, {
    padding: 5,
    marginRight: 3,
    marginBottom: 3,
    borderRadius: 2,
    borderWidth: 0,
    borderColor: "gray0",
    backgroundColor: active ? "primary0" : undefined,
  });

  return (
    <Styled onPress={onPress}>
      <Text>{title}</Text>
    </Styled>
  );
};

const QueryContainer = ({ data, renderItem }) => {
  const Styled = styled(View, {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  });

  return (
    <Styled>{_.map(data, (item, index) => renderItem({ item, index }))}</Styled>
  );
};

const getData = (selected: number[]) => {
  if (selected.length === 0) return searchTerms;

  const term0 = searchTerms[selected[0]];
  if (selected.length === 1) return [{ name: term0.name }, ...term0.categories];

  const term1 = term0.categories[selected[1] - 1];
  return [{ name: term0.name }, { name: term1.name }];
};

const getTerms = (selected: number[]) => {
  if (selected.length === 0) return "";

  const term0 = searchTerms[selected[0]];
  if (selected.length === 1) return term0.name;

  const term1 = term0.categories[selected[1] - 1];
  return `${term1.name} ${term0.name}`;
};

export default function CategoriesBar({ onChange }) {
  const [selected, setSelected] = useState([]);

  const onPress = (index) => {
    // select main category
    if (selected.length === 0) return setSelected([index]);
    // deselect main category
    if (selected.length > 0 && index === 0) return setSelected([]);
    // deselect sub category
    if (selected.length === 2) return setSelected([selected[0]]);
    // select sub category
    setSelected([selected[0], index]);
  };

  useEffect(() => {
    onChange(getTerms(selected));
  }, [selected]);

  const isActive = (index) => {
    if (index === 0 && selected.length > 0) return true;
    if (index === 1 && selected.length > 1) return true;
  };

  const renderItem = ({ item, index }) => {
    return (
      <QueryButton
        onPress={() => onPress(index)}
        title={item.name}
        active={isActive(index)}
      />
    );
  };

  return (
    <View>
      <QueryContainer data={getData(selected)} renderItem={renderItem} />
    </View>
  );
}
