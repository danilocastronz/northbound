# Contributing to Northbound

Applies whether the change came from a person or from Claude Code.
See chapter 7 of the book for the reasoning behind each of these.

1. Branch before starting any real task. Never commit directly to main.
2. Read the full diff before committing, not just the part you expected
   to change. Watch especially for unrelated files, reformatting, or
   deleted tests riding along with an otherwise correct fix.
3. Keep commits scoped to one thing. If a diff mixes a fix with
   unrelated cleanup, split it.
4. A test file changing is not automatically fine just because the
   suite goes green. If a test was weakened or removed, the commit
   message should say why.
5. Write commit messages that explain the reasoning, not just what
   changed.
