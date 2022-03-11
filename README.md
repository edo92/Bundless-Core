# Bundler

## Example

- Code
```js
const bundler = new Bundler({
    name: 'output file name <File_Name.zip>',
    entry: 'entry path where index.js and package.json',
});

bundler.bundle();
```

-Cli
```bash
    npx bundless -e <Entry_Path> -o <Out_dir> -
```