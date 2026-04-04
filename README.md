# mth.js

Small js script/module that converts a subset of markdown tags into html. Designed for my [blog](https://github.com/kotsuban/kotsuban.github.io/tree/main/website/blog) system.

## List of supported markdown tags

```
paragraph                       -> <p>paragraph</p>
# h1 heading                    -> <h1>h1 heading</h1>
## h2 heading                   -> <h2>h2 heading</h2>
### h3 heading                  -> <h3>h3 heading</h3>
* unordered list                -> <ul><li>unordered list</li></ul>
--- horizontal line             -> <hr>
"```" code block                -> <pre><code>code block</code></pre>
![image](image.png)             -> <img src="image.png" alt="image" />
[link](https://www.google.com/) -> <a href="https://www.google.com/">link</a>
inline **bold**                 -> <p>inline <b>bold</b></p>
inline *italic*                 -> <p>inline <i>italic</i></p>
inline `code`                   -> <p>inline <code>code</code></p>
```

## Usage

As a module:
```
import { mth } from "mth.js"

mth("# Hello World!");
```

As a nodejs script:
```
node mth.js example.md
node mth.js "# Hello World!"
```
