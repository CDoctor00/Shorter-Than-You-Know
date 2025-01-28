This file is a note to explain how the regex used to check the strings' correctness works.

## The URL regex

The following regex has been used in the `checkURL` function at [shorten.go](./shorten.go) file to check the correctness of the URL sitax.

### The sintax

```
^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$
```

### The explanation

- `^`: This symbol indicates the start of the string.

- `(https?:\/\/)?`: The part `https?` means it can be "http" or "https". The `?` symbol after **s** makes the "s" optional, so it can be present or not. `:\/\/` is the escape sequence for "://". The entire group is enclosed in parentheses `()`, and the `?` outside makes the whole group optional, allowing for links without the protocol as well.

- `(www\.)?`: This optional group allows for "www." at the start of the URL, but it can also be absent.

- `[a-zA-Z0-9@:%._\+~#=]{2,256}`: This matches a sequence of alphanumeric characters and other common URL characters like **@, %, ., \_, +, ~, #, =**. The part `{2,256}` indicates that there must be at least 2 characters and at most 256.

- `\.[a-z]{2,6}`: This matches the top-level domain (TLD), like **.com, .org, .net**, etc. The part `[a-z]{2,6}` indicates that the TLD must be composed of 2 to 6 lowercase letters.

- `\b`: This is a word boundary anchor, ensuring that the TLD is followed by a word boundary (space, end of string, or non-alphanumeric character).

- `([-a-zA-Z0-9@:%_\+.~#?&\/=]*)`: This group matches the path and parameters of the URL, which can include a variety of alphanumeric characters and common URL symbols. The `*` symbol means this group can be present zero or more times.

- `$`: This symbol indicates the end of the string.

<br>

## The Email regex

The following regex has been used in the `checkEmail` function at [registration.go](./registration.go) file to check the correctness of the email sitax.

### The sintax

```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### The explanation

- `^`: This symbol indicates the start of the string.

- `[a-zA-Z0-9._%+-]+`: This matches a sequence of alphanumeric characters and other common URL characters like **%, ., \_, +, -**. It represents the local part of an email (the part before **@**).

- `@`: The mandatory "at" symbol.

- `[a-zA-Z0-9.-]+`: This matches a sequence of alphanumeric characters and other common URL characters like dots and hyphens. It represents the domain name of the email.

- `\.[a-zA-Z]{2,}`: This matches the top-level domain (TLD), like **.com, .org, .net**, etc. The part `{2,}` indicates that the TLD must be composed at least 2 letters.

- `$`: This symbol indicates the end of the string.
