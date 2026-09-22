# northbound-toolkit

The plugin from chapter 10, bundling the add-carrier-integration
skill so it installs in one step for anyone on the team, rather than
each person copying it into their own `.claude/skills/` by hand.

## Installing it

From inside a Claude Code session, in this repo:

```
/plugin marketplace add ./
/plugin install northbound-toolkit@northbound
```

See `.claude-plugin/marketplace.json` at the repo root for the
marketplace entry this depends on.
