import React, { useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

import { styled } from "react-native-reflect";

import searchTerms from "./searchTerms";

// STODONEXT improve this? maybe add function option:
//
// styled(TouchableOpacity, ({ active }) => {
//  padding: 5,
//  marginRight: 2,
//  borderRadius: 2,
//  borderWidth: 0,
//  borderColor: "gray0",
//  backgroundColor: active ? "red" : null,
// })
//
const QueryButton = ({ active = false, children }) => {
  const Styled = styled(TouchableOpacity, {
    padding: 5,
    marginRight: 2,
    borderRadius: 2,
    borderWidth: 0,
    borderColor: "gray0",
    backgroundColor: active ? "red" : null,
  });

  return <Styled>{children}</Styled>;
};

const QueryContainer = styled(
  FlatList,
  { marginBottom: 5, marginTop: 5 },
  { horizontal: true }
);

export default function CategoriesBar({}) {
  const renderItem = ({ item }) => (
    <QueryButton>
      <Text>{item.name}</Text>
    </QueryButton>
  );

  const [data, setData] = useState(searchTerms);
  return (
    <View>
      <QueryContainer data={data} renderItem={renderItem} />
    </View>
  );
}
