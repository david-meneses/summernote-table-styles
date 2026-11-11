# summernote-table-styles (Tailwind Edition)

An adaptation of [tylerecouture/summernote-table-styles](https://github.com/tylerecouture/summernote-table-styles) that applies [Tailwind CSS](https://tailwindcss.com/) utility classes to tables instead of Bootstrap classes.

A [Summernote](https://summernote.org/) plugin that adds a button to the table popover allowing the user to apply [Tailwind CSS table styles](https://tailwindcss.com/docs/table-layout).

There are two types of styles, exclusive and inclusive. Only one exclusive style may be chosen at a time, whereas multiple inclusive styles may be chosen. Currently applied styles are indicated with check marks.

**Exclusive Styles**
* Basic (Light gray borders on all cells)
* Bordered (Dark borders on all cells)

**Inclusive Styles**
* Striped (Alternating row background colors)
* Condensed (Reduced text size)
* Hoverable (Highlight row on hover)

### Usage

1. Add `summernote-table-styles.js` to your project
2. Customize the Summernote table popover to include `tableStyles`
````
$(document).ready(function() {
  $('#summernote').summernote({
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
        ['custom', ['tableStyles']]
      ],
    },
  });
});
````

### Notable Changes (Tailwind Compatibility)

This adaptation modifies the original plugin to use Tailwind CSS utility classes instead of Bootstrap classes. Key changes include:

* **Tailwind Utility Classes**: Table styles now apply Tailwind classes like `border`, `border-gray-900`, `[&_th]:border`, `[&_tbody_tr:nth-child(odd)]:bg-gray-100`, and `[&_tbody_tr:hover]:bg-gray-100`

* **Arbitrary Child Selectors**: Uses Tailwind's arbitrary selector syntax `[&_*]` to target child elements (headers, data cells, rows) since classes are applied at the table level

* **Dynamic Class Removal**: Modified the `updateStyles()` function to properly remove Bootstrap's `table-bordered` class when applying Tailwind styles, preventing style conflicts

* **Bootstrap Dependency**: While the plugin uses Tailwind for table styling, Bootstrap CSS is still required for Summernote's UI components (toolbar, buttons, dropdowns). The example demonstrates using both frameworks together

* **Class Mapping**: Updated style definitions to use modern Tailwind utilities:
  - Basic: `border border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_td]:border [&_td]:border-gray-300`
  - Bordered: `border border-collapse [&_th]:border [&_th]:border-gray-900 [&_td]:border [&_td]:border-gray-900`
  - Striped: `[&_tbody_tr:nth-child(odd)]:bg-gray-100`
  - Hoverable: `[&_tbody_tr:hover]:bg-gray-100`

