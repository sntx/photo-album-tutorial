# Responsive UX Design with React Native Reflect (Part 2)

## Description

The following tutorial explains step by step how to create a responsive photo album application with React Native and [React Native Reflect](https://sntx.github.io/react-native-reflect) that works on Web and Native devices.

Our photo album will display images in a grid with variable number of columns, image aspect ratio, grid separation, etc. all in a responsive manner.

After finishing the tutorial you will learn how to:

- Create a responsive image gallery (Part 1)
- Create a re-usable, customizable image gallery component (Part 2)
- Create universal, responsive and theme-based UIs! (Part 3)

## Contents

- [Part 1 - Responsive Image Grid](./PART1.md)
- [Part 2 - Improved Responsive Image Grid](./PART2.md)
- [Part 3 - Responsive UI and Theme](./PART3.md)

## Theming

**NOTE: this is Part 3 of this tutorial series. To continue from here you will need to have completed [Part 2](./PART2.md)**

On [Part 2](./PART2.md) of this tutorial series we finished building an image grid component with responsive number of columns, grid spacing and aspect ratio. On Part 3 we will add the option to query differnt images of various galaxies and style the rest of the app. Let's start by exploring React Native Reflect's theme functionality.

**TODO rename React Native Reflect's with links**

Add the following lines to our `App()` component and look at the logged output.

```typescript
import { useStyled, defaultTheme } from "react-native-reflect";
console.log(defaultTheme);
```

Notice the following properties of `defaultTheme`:

- `breakpoints`: screen width dimensions at which responsive values change (an abbreviated way to define media queries).
- `sizes`: theme values for `width`, `height`, etc.
- `space`: theme values for `padding`, `maring`, etc.
- You get an idea of what the other properties are for. A complete guide to Reflect's theme can be found here: [Reflect / Theme](https://sntx.github.io/react-native-reflect/#/?id=theme)

We'll create our own theme object by extending `defaultTheme` and use it with `ThemeProvider` to set a global theme for our application. Modify `App.tsx` as follows:

```typescript
import { useStyled, defaultTheme, ThemeProvider } from "react-native-reflect";

const theme: Theme = {
  ...defaultTheme,
  colors: { lightGray: "#EAEBEE", highlight: "#E9F0FE" },
  space: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  sizes: [0, 2, 4, 8, 16, 20, 32, 64, 128, 256],
  radii: [0, 15, 30],
};
```

Finally, wrap the return value of `App()` with `<ThemeProvider value={theme}`:

```typescript
return <ThemeProvider value={theme}>...</ThemeProvider>;
```

Now, every time with use Reflect's `styled()` or `useStyled()` methods we'll have access to our global theme.

## Search Terms Buttons

So far our app is displaying images based on a fixed query. Let's extend it by providing various predefined search queries. The new search queries will be rendered as buttons, once we tap on a button, the search query will update, new images will be rendered, and the rest of the buttons will hide. After we tap the active button, the search query will reset and all the other buttons will show again.
