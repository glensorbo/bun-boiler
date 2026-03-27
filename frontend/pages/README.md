# 📄 Pages

One file per route. Pages are intentionally thin — they import and compose feature components, they do not own logic themselves.

```
pages/
└── homePage.tsx   →  route "/"
```

## Conventions

- Filename matches the route intent, lowerCamelCase.
- Pages may import from `features/` and `shared/`, not from each other.
