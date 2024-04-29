This library is used to make it easier to work with DOM (and calling backend), no matter if you are using a SPA framework or not.

# What the frack do you get?

You can work easier with forms:

```html
<form name="userForm">
    <div>
        <Label for="firstName"></label>
        <input id="firstName" />
    </div>
    <div>
        <Label for="lastName"></label>
        <input id="lastName" />
    </div>
    <div>
        <label for="superMode"></label>
        <input type="checkbox" id="supermode" value="true" checked />
    <div>
        <Label for="age"></label>
        <input id="age" type="number" />
    </div>
    <div data-name="address">
        <div>
            <Label for="street"></label>
            <input id="street" />
        </div>
        <div>
            <Label for="city"></label>
            <input id="city" />
        </div>
        <div>
            <Label for="postalCode"></label>
            <input id="postalCode" type="number" />
        </div>
</form>
```

Which is read like this:

```js
var reader = new FormReader();
var newUser = reader.read("userForm");
```

The generated object from the form read looks like this:

```js
{
    firstName: 'SomeFirstName',
    lastName: 'SomeLastName',
    age: 32,
    superMode: true,
    address: {
        street: 'SomeStreet',
        city: 'SomeCity',
        postalCode: 12345
    }
}
```

Finally you can post it to the backend:

```js
var client = new HttpClient({urlPrefix: 'http://myserver/api/'});
var response = await client.post('/users', newUser);

if (!response.success) {
    console.log('uh oh!');
}
```

# More docs

Navigate the folders and documents here under the docs :)

