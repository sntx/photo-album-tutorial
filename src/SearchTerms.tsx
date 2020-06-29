import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Text, View, TouchableOpacity } from "react-native";

import { styled } from "react-native-reflect";

const SEARCH_TERMS = [
  "Milky Way",
  "Andromeda",
  "Antennae Galaxies",
  "Black Eye Galaxy",
  "Butterfly Galaxies",
  "Cartwheel Galaxy",
  "Fireworks Galaxy",
  "Sombrero Galaxy",
  "Cigar Galaxy",
  "Sculptor Galaxy",
  "Sunflower Galaxy",
  "Whirlpool Galaxy",
];

type OnPress = () => void;
type TermButtonProps = { title: string; onPress: OnPress; active: boolean };

/**
 * Renders single search term item as a styled TouchableOpacity component.
 *
 * TermButton style values are responsive and theme-based, look at
 * comments below for more info
 */
const TermButton = ({ title, onPress, active }: TermButtonProps) => {
  const Styled = styled(TouchableOpacity, {
    // themed value -> 5 -> theme.space[5] = 20
    padding: 5,
    // smaller screens: 0 -> no marginRight, since button will be full width
    // larger  screens: themed value -> 3 -> theme.space[3] = 8
    marginRight: [0, 3],
    marginBottom: 3,
    borderRadius: 1,
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

type RenderItem = ({
  item,
  index,
}: {
  item: string;
  index: number;
}) => JSX.Element;
type TermButtonsProps = { data: string[]; renderItem: RenderItem };

/**
 * Renders search terms buttons as follows:
 * - smaller screens: full width columns (one search term per column)
 * - larger  screens: wrapped rows (search termns next to each other in a row)
 */
const TermButtons = ({ data, renderItem }: TermButtonsProps) => {
  const Styled = styled(View, {
    flex: 1,
    // themed value -> 3 -> theme.space[3] = 8
    marginTop: 3,
    // "column" on smaller screens, "row" on larger screens
    flexDirection: ["column", "row"],
    // "nowrap" on smaller screens, "wrap" on larger screens
    flexWrap: ["nowrap", "wrap"],
  });

  return (
    <Styled>{_.map(data, (item, index) => renderItem({ item, index }))}</Styled>
  );
};

type SearchTerms = { onChange: (term: string) => void };

/**
 * Renders search terms as a list of buttons.
 * - Tapping on a button, selects it and hides all other buttons
 * - Tapping on a selected button, de-selects it and shows all other buttons
 * - onChange(term) gets called on term selection updates with the updated term
 */
export default function SearchTerms({ onChange }: SearchTerms) {
  const [selected, setSelected] = useState(-1); // index of selected search term

  const onPress = (index: number) => {
    if (selected > -1) return setSelected(-1); // reset selection
    setSelected(index); // set selection
  };

  useEffect(() => {
    // onChange is called with the selected term or "" if no term is selected
    onChange(selected < 0 ? "" : SEARCH_TERMS[selected]);
  }, [selected]);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <TermButton
        onPress={() => onPress(index)}
        title={item}
        active={selected > -1}
      />
    );
  };

  return (
    <TermButtons
      // <  0 will render all search terms
      // >= 0 will render only selected term
      data={selected < 0 ? SEARCH_TERMS : [SEARCH_TERMS[selected]]}
      renderItem={renderItem}
    />
  );
}

