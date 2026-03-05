#!/bin/bash
# sync your local sapling stack with upstream

# good debuggable default for bash
set -e

# pass lint before interacting with upstream
make lint 

# rebase upstream over local
sl pull --rebase -d main 

# restack only when the commit graph has orphans — draft commits whose
# parent was rewritten (amend/absorb) but whose children weren't rebased.
# "children(obsolete()) - obsolete()" finds exactly these stragglers.
needs_restack=$(sl log --rev "children(obsolete()) - obsolete()" -T "{node}\n" 2>/dev/null | head -1)
if [ -n "$needs_restack" ]; then
  sl restack
fi

# push when there are draft commits on the stack above main
# (draft() & ancestors(.) & descendants(main)). Side-branch drafts are
# ignored so they don't trigger a push.
draft_on_main=$(sl log --rev "draft() & ancestors(.) & descendants(main)" -T "{node}\n" 2>/dev/null | head -1)
if [ -n "$draft_on_main" ]; then
  sl push --to main
fi
