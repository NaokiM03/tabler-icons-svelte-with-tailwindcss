This library is a fork project of [tabler-icons-svelte](https://github.com/benflap/tabler-icons-svelte)

This library provides components that export class attributes for TailwindCSS users.

# tabler-icons-svelte-with-tailwindcss

A library of Svelte components for [Tabler Icons](https://github.com/tabler/tabler-icons).

> A set of 2907 free MIT-licensed high-quality SVG icons for you to use in your web projects. Each icon is designed on a 24x24 grid and a 2px stroke.

## Installation

```sh
# npm
npm install -D tabler-icons-svelte-with-tailwindcss
```

`tabler-icons-svelte-with-tailwindcss` needs to be added as a dev dependency as Svelte [requires original component source](https://github.com/sveltejs/sapper-template#using-external-components)

## Usage

Import components inside of the `<script>` and use like any other Svelte component.

Find icons:

- Search on [tabler-icons.io](https://tabler-icons.io/)
- View [component names](ICON_INDEX_DOC.md)

### Import Components From Package

The easiest way to use the icon components is by importing them from the package.

```svelte
<script>
    import { CurrencyBitcoin, BrandGithub, CircleX } from "tabler-icons-svelte-with-tailwindcss";
</script>

<CurrencyBitcoin />
<BrandGithub />
<CircleX />
```

## Props

The components each accept only 1 props:

| Prop  | Default                           |
| ----- | --------------------------------- |
| class | "h-6 w-6 stroke-current stroke-2" |

## License

[MIT](LICENSE)
