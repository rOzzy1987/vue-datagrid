
# VUE3 Data Grid

![image](https://user-images.githubusercontent.com/617600/233993154-0aee5392-77b4-437a-8405-371536653df6.png)

This project is an attempt to have a lightweight data grid component that is easy to configure to your application's needs

I'd be happy to get feature requests, improvement ideas, but please keep in mind that this is a weekend project of mine. If you're a developer and can work your way through the code, fix what you want, and create a pull request.

## Usage 
### General
add the package to yout app and include the source files you need, like

    import { GridColumnDefinition } from  '@rozzy/vue-datagrid/src/GridColumnDefinition';
	import { GridRowCommandDefinition, type  IGridRowCommandDefinition } from  '@rozzy/vue-datagrid/src/GridCommandDefinition';

### Dependencies
The project is mainly using Bulma as the CSS library, but you can define which CSS classes are applied to each type of element. For this, you'll have to pass a `GridStyleDefinition` object when defining the grid

The example code is using SCSS styles, so you'll need _sass_ to compile them

Obviously Vue3 is needed as the name suggests

## Examples
There are a lot of examples under the `examples` directory to check them out you need to run

```sh
npm install
```
then 

```sh
npm run dev
```

