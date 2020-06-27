# Build a Responsive React Native Photo Album (Part 2)

## Description

The following tutorial explains step by step how to create a responsive photo album with React Native that works on Web and Native devices.

Our photo album will display images in a grid with variable number of columns, image aspect ratio, grid separation, etc. all in a responsive manner.

After finishing the tutorial you will learn how to:

- Create a responsive image gallery (Part 1)
- Create a re-usable, customizable image gallery component (Part 2)
- Create a responsive, theme-based UI (Part 3)

## Contents

- [Part 1 - Responsive Image Grid](./PART1.md)
- [Part 2 - Improved Responsive Image Grid](./PART2.md)
- [Part 3 - Responsive UI and Theme](./PART3.md)

## Time for Math!

**NOTE: this is Part 2 of this tutorial series. To continue from here you will need to have completed [Part 1](./PART1.md)**

On [Part 1](./PART1.md) of this tutorial series we displayed a grid of images with a fixed aspect ratio, on part 2 we will add spacing to our grid, similar to `grid-spacing` `CSS` property. To do so we will calculate the explicit dimensions of the images based on the width of our container and spacing. These calculations are required in React Native, since React Native requires explicit dimensions to be provided to Image components.

Below is a sketch of all the math we need to make this work:

![Grid Calculations 01](https://github.com/sntx/photo-album-tutorial/raw/master/docs/images/grid-calculations-01.jpg)

Our strategy for creating grid spacing is as follows:

- Calculate exact image dimensions.
- Add `marginRight` style to all images, except the last images on rows.
- Add `marginBottom` style to all images.
