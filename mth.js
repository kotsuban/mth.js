const PATTERNS = {
  H1: "# ",
  H2: '## ',
  H3: '### ',
  LI: '* ',
  HR: '---',
  CODE: '```',
}

const STATE = {
  DEFAULT: 'DEFAULT',
  LIST: 'LIST',
  CODE: 'CODE'
}

function inline(content = "") {
  return content
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => {
      return `<img href="${href}" alt="${alt}" />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      return `<a href="${href}">${text}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, (_, text) => {
      return `<b>${text}</b>`;
    })
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_, text) => {
      return `<i>${text}</i>`;
    })
    .replace(/`([^`]+)`/g, (_, code) => {
      return `<code>${code}</code>`;
    });
}

/** Parse a markdown to html. */
export function mth(md = '') {
  const lines = md.split('\n');
  const result = [];
  let state = STATE.DEFAULT;

  for (const line of lines) {
    switch (state) {
      case STATE.DEFAULT:
        if (line.startsWith(PATTERNS.H1)) {
          result.push(`<h1>${inline(line.slice(PATTERNS.H1.length))}</h1>`)
          break;
        }
        if (line.startsWith(PATTERNS.H2)) {
          result.push(`<h2>${inline(line.slice(PATTERNS.H2.length))}</h2>`)
          break;
        }
        if (line.startsWith(PATTERNS.H3)) {
          result.push(`<h3>${inline(line.slice(PATTERNS.H3.length))}</h3>`)
          break;
        }
        if (line.startsWith(PATTERNS.LI)) {
          result.push(`<ul>`)
          result.push(`<li>${inline(line.slice(PATTERNS.LI.length))}</li>`)
          state = STATE.LIST
          break;
        }
        if (line.trimEnd() === PATTERNS.HR) {
          result.push(`<hr>`)
          break;
        }
        if (line.trimEnd() === PATTERNS.CODE) {
          result.push(`<pre>`)
          result.push(`<code>`)
          state = STATE.CODE
          break;
        }
        if (line.trim().length > 0) {
          result.push(`<p>${inline(line)}</p>`)
          break;
        }

        result.push(line)
        break;
      case STATE.LIST:
        if (line.startsWith(PATTERNS.LI)) {
          result.push(`<li>${inline(line.slice(PATTERNS.LI.length))}</li>`)
          break;
        }

        result.push(`</ul>`)
        state = STATE.DEFAULT
        break;
      case STATE.CODE:
        if (line.trimEnd() === PATTERNS.CODE) {
          result.push(`</code>`)
          result.push(`</pre>`)
          state = STATE.DEFAULT
          break;
        }

        result.push(line)
        break;
    }
  }

  return result.join('\n');
}

if (typeof process !== 'undefined' && process.argv[1] === new URL(import.meta.url).pathname) {
  const fs = await import('fs');
  const path = await import('path');

  const arg = process.argv[2];

  if (!arg) {
    console.error('Usage: node mth.js <file.md>');
    console.error('       node mth.js "# markdown to html"');
    process.exit(1);
  }

  let input;
  try {
    input = fs.readFileSync(path.resolve(arg), 'utf8');
  } catch {
    input = arg;
  }

  process.stdout.write(mth(input) + '\n');
}
