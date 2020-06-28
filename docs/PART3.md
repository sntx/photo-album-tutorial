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

On [Part 2](./PART2.md) of this tutorial series we finished building an image grid component with responsive number of columns, grid spacing and aspect ratio, on Part 3 we will style the rest of the app. Let's start by exploring React Native Reflect's theme functionality.

**TODO review this paragraph, make it shorter and remove the I's?**

**TODO rename React Native Reflects with links**

React Native Reflect is inspired by Styled Components and Styled System, but built from the ground up for React Native. At the time I was building web applications with Styled System and was very happy at how easy and succinct it was to style and create responsive UIs with Styled System. I studied similar alternatives for React Native and wasn't convinced with the available options. It is possible to use Styled Components and Styled System in React Native and adding polyfills for media queries (for responsive behavior). However, this would add many layers of complexity, dependencies, a somewhat odd syntax (CSS strings inside React Native) to a project and increase the bundle size. Whenever possible, I prefer lean and minimal solutions, React Native Reflect is 4KB zipped and has no external styling dependencies.

To get started, add the following lines to our `App()` component and look at the logged output.

```typescript
import { useStyled, defaultTheme } from "react-native-reflect";
console.log(defaultTheme);
```

Notice the following properties of `defaultTheme`:

- `breakpoints`: screen width dimensions at which responsive values change (an abbreviated way to define media queries).
- `sizes`: theme values for `width`, `height`, etc.
- `space`: theme values for `padding`, `maring`, etc.
- You get an idea of what the other properties are for. A complete guide to Reflect's theming can be found here: [Reflect / Theme](https://sntx.github.io/react-native-reflect/#/?id=theme)

What if we want to modify the default theme? No problem, we can use Reflect's `ThemeProvider` for that. An easy way to define your theme is to extend from the `defaultTheme` as follows:

```typescript
import { useStyled, defaultTheme, ThemeProvider } from "react-native-reflect";

const theme = {
  ...defaultTheme,
  space: [0, 2, 4, 8, 16, 32, 64],
};
```

Finally, wrap the return value of `App()` with `<ThemeProvider value={theme}`:

```typescript
return (
  <ThemeProvider value={theme}>
    <SafeAreaView>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ImageGrid
          data={data}
          numColumns={attrs.numColumns}
          aspectRatio={attrs.imageAspectRatio}
          gridGap={attrs.gridGap}
        />
      )}
    </SafeAreaView>
  </ThemeProvider>
);
```

Now, our whole application will use the theme object we defined above.

## UI Design

So far our app is displaying a bunch of spiral galaxies images using a fixed search query. Let's make it a bit more useful and extend it by providing different built-in search queries. We'll display galaxies, stars or planets with sub-categories for each such as "Spiral Galaxies", "Elliptical Galaxies", "Red Giant Stars", "Trojan Planets", etc. We'll build UI elements to select a main category and a sub category and perform the search accordingly.
