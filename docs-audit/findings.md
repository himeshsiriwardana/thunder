# ThunderID Release-to-Docs Audit

Release: v1.0.1

## Finding 001 — OIDC signing algorithm metadata

- Commit: 642c31cb4
- Change: Advertise token endpoint authentication signing algorithms
- Documentation: docs/content/guides/protocols/oauth-oidc/server-metadata.mdx
- Documentation updated in same commit: Yes
- Status: Needs technical verification

### Evidence

The documentation lists seven token endpoint authentication
signing algorithms.

The runtime cryptographic provider returns ten algorithms,
including MLDSA44, MLDSA65, and MLDSA87.

The discovery service uses this provider to populate
the metadata field.

### Outstanding questions

1. Are all ten algorithms advertised by the actual endpoint?
2. Are all ten valid for the advertised token endpoint
   authentication methods?
3. Is the JSON response intended to represent the complete
   supported set?

### Proposed action

Verify the actual discovery response against v1.0.1.
Update the reference example or clarify its illustrative
nature if a discrepancy is confirmed.


## Finding 002 — OIDC ui_locales support

- Commit: 86368db4a
- Change: Support the ui_locales authorization request parameter
- Release: v1.0.1
- Documentation updated in same commit: No
- Status: Probable documentation gap

### Evidence

The authorization service extracts ui_locales from the request,
stores it in the authorization parameters, and forwards it
when initiating the authentication flow.

No exact ui_locales references were found in the v1.0.1 docs.

The existing Localization concept explains translation resolution,
language matching, and fallback behavior, but does not explain
how an OAuth client supplies ui_locales.

### Proposed documentation updates

1. Document ui_locales in the OAuth/OIDC authorization
   request parameter reference.
2. Add a short cross-reference in the Localization concept.

### Outstanding verification

Confirm that the authentication UI uses the forwarded parameter
to select its language, including supported matching and fallback
behavior.
