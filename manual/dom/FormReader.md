FormReader
===========

Enables you to read forms into javascript objects by following some simple conventions.

```html
<body>
    <form id="myForm">
        <input name="name" value="Arne">
    </form>
</body>
```

The form is ready by using:

```javascript
var reader = new FormReader();
var obj = var reader.read('#myForm');
</script>
```

The resulting object:

```javascript
{
    name: "Arne"
}
```

# Data types

Form values are automatically converted into different data types based on their values.

## Numbers

Elements whos values are only numbers will automatically be converted to the number type in javascript.

```html
<body>
    <form>
        <input name="userId" type="number" value="3">
    </form>
</body>
```

Results in object:

```javascript
{
    userId: 3
}
```

## Booleans

Fields which value is either `true` or `false` will be converted to boolean.

```html
<input type="checkbox" name="isActive" value="true">
```

Resulting object:

```javascript
{
    isActive: true
}
```

## Arrays

Some elements, like SELECT, supports arrays implicitly. For other element types, arrays are detected when square brackes are included in the name:

```html
<form>
    <input type="age[]" value="18">
    <input type="age[]" value="30">
    <input type="age[]" value="40">    
</form>
```

Results in

```javascript
{
    age: [18, 30, 40]
}
```

Arrays also work for nested types, indexing is important in this scenario so that the reader knows when the old object is done and a new object should be generated.

```html
<form>
    <input type="users[0].firstName" value="Jo">
    <input type="users[0].lastName" value="Ghurt">

    <input type="users[1].firstName" value="Bo">
    <input type="users[1].lastName" value="Ner">
</form>
```

Resulting in

```javascript
{
    users: [{firstName = "Jo", lastName = "Ghurt"}, {firstName = "Bo", lastName = "Ner" }]
}
```

You can also wrap the nested object in another HTML element which does not require indexing.

```html
<form>
    <div data-name="users[]">
        <input type="firstName" value="Jo">
        <input type="lastName" value="Ghurt">
    </div>
    <div data-name="users[]">
        <input type="firstName" value="Bo">
        <input type="lastName" value="Ner">
    </div>
</form>
```

# Element handling

Here is how the reader works for different form element types.

## SELECT elements

The SELECT element will either result in a single value or a value array.

For a normal SELECT:

```html
<body>
    <form>
        <select name="state">
            <option value="2">2</option>
            <option value="3" selected>3</option>
        </select>
    </form>
</body>
```

Result:

```javascript
{
    state: 3
}
```

The returned object contains an array when the `multiple` attribute is used:

```html
<body>
    <form>
        <select name="states" multiple>
            <option value="a">1</option>
            <option value="b" selected>2</option>
            <option value="c" selected>3</option>
        </select>
    </form>
</body
```` 

Result:

```javascript
{
    states: ['b', 'c']
}
```

## Checkboxes and radio buttons

Their values are only appended to the JS object if they are checked.

`<input id="eula" type="checkbox" value="true" checked>` 

Result:
```js
{ eula: true }
```

While not being checked will return in nothing:

`<input id="eula" type="checkbox" value="true">` 

Result:
```js
{ }
```

Their values are converted to `boolean` if the values are `true` or `false`.

Use the `FormReader` options to include the field when nothing is selected/checked.

## 