# When Claude Code Goes Sideways on This Project

Quick reference matching chapter 8 of the book. Full explanations
and recovery steps are there; this is the short version to have open
while you work.

## The loop
Claude tries something, it fails, it tries a slightly different
version of the same idea, repeatedly. Stop it. Rewind to before the
loop started and change what you give it, don't just ask again.

## Wrong scope
A diff touches a file you didn't mean, often because a request named
a behavior ("fix the delivery bug") without naming which of the three
carrier modules. Be specific about the file, not just the symptom.

## The test that stopped complaining
A failing test starts passing, but by being weakened or deleted
rather than by the underlying bug being fixed. Any diff touching
`__tests__/` deserves extra scrutiny, not less.

## Context degrading mid-session
Claude contradicts something agreed on earlier in a long session, or
forgets a constraint from CLAUDE.md. Check `/context`. Consider
`/clear` and a clean restart with the essentials restated, rather
than pushing through.
