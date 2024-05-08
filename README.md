# Parcel optimizer hoist object properties

Transform object property name to computed property to compress log names

example

```js
function sample() {
  return {
    // ...
    this_is_a_log_property_name: 'value',
    // ...
  };
}

const this_var = {
  this_is_a_log_property_name: 'value',
};
```

will transform to

```js
var $prop$a = 'this_is_a_log_property_name';

function sample() {
  return {
    [$prop$a]: 'value',
  };
}

const this_var = {
  [$prop$a]: 'value',
};
```

and remove any duplicate property name and make it to computed property, but you still need to optimize name by use `@parcel/optimizer-swc` to minify property names

### Usage

```json5
{
  "optimizer": {
    // ...
    "*.{js,mjs,cjs}": [
      "parcel-optimizer-hoist-object-properties", 
      "@parcel/optimizer-swc"
    ]
    // ...
  }
}
```
