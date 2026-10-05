<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Keep calculator math and configuration in a browser-safe pure module separate from reusable form/result components, so calculations are independently testable.
- Keep calculator input and results in transient React state only, because this tool must not retain personal data.
- Express the reference site's appearance through global semantic tokens and calculator design-system classes, so all views remain visually consistent.
