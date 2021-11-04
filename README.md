# OBF - brainf**k (but readable... so like... unbrainf\**k)

OBF was originally a programming language thought of by my friend.

OBF is an objective approach to a programming language, every function is like JSON, it contains key-value pairs which are passed into
bound JavaScript functions at runtime.

OBF's syntax is a bit strange; to register another key-value pair you need to end every declaration with ':', or ','.

```obf

writeToConsole {
    message: "Hello!",
};

```

```js

function writeToConsole(props) {
    let msg = props.message || null

    console.log(msg)
}

```

## builtins

### writeToConsole

WriteToConsole expects the `message` property to be active.

It prints the message property.

