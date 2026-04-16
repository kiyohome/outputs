# aiya-pit

> Go wild in here — sandbox

<!-- NOTE: The overall architecture diagram, security model, and monorepo layout are consolidated in ../README.md. -->

Provides an isolated environment where AI agents can work at full speed without affecting the host. The four main building blocks are the container image, filesystem isolation, network isolation, and CA certificate management.

## Quickstart

<!-- TODO: "docker compose up" one-liner instructions -->

```
# TODO
```

## Container image

- Full toolchain needed to run Claude Code (Node.js, Git, various build tools)
- Designed to be launched with `--dangerously-skip-permissions`
- CA certificate trust configured for each tool (npm, pip, curl, Node.js, etc.)

## Filesystem isolation

- A bind mount exposes only the working directory (a git worktree) as `/workspace`
- No access to host files such as `~/.ssh` or `~/.gitconfig`
- All changes inside the container are confined to the worktree

## Network isolation

- Docker's `internal: true` network setting physically cuts the CC container off from external access
- The CC container and aiya-proxy sit on that internal network
- Only aiya-proxy also attaches to the external (bridge) network and relays outbound traffic
- Direct outbound TCP from the CC container is impossible
- `ANTHROPIC_BASE_URL` points at aiya-proxy so that API traffic is recorded as well

## CA certificate management

- A self-hosted CA certificate for HTTPS MITM is injected into the container
- The CA private key is generated fresh every time the container starts, and is ephemeral (never persisted)
- The CA private key is placed outside CC's working directory with restricted permissions
- Certificate setup per tool:
  - System: `update-ca-certificates`
  - Node.js: `NODE_EXTRA_CA_CERTS`
  - npm: `cafile`
  - pip: `REQUESTS_CA_BUNDLE`
  - curl: `CURL_CA_BUNDLE`
  - git: `http.sslCAInfo`

## docker-compose

Example `cc-template` service definition:

```yaml
cc-template:
  build: ./docker
  environment:
    - ANTHROPIC_BASE_URL=http://aiya-proxy:8080
    - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    - NODE_EXTRA_CA_CERTS=/etc/ssl/certs/aiya-ca.crt
    - REQUESTS_CA_BUNDLE=/etc/ssl/certs/aiya-ca.crt
    - CURL_CA_BUNDLE=/etc/ssl/certs/aiya-ca.crt
  volumes:
    - type: bind
      source: ${WORKTREE_PATH}
      target: /workspace
  networks: [sandbox]       # internal-only → no direct external access
  profiles: [cc]

# aiya-proxy is attached to both networks (informational in the pit doc)
# aiya-proxy:
#   networks: [sandbox, external]

networks:
  sandbox:
    internal: true            # external access blocked
  external:
    driver: bridge            # only aiya-proxy attaches here
```

## Single use (without aiya-tape)

aiya-pit can be used without the proxy. In that mode:
- Only filesystem isolation is active
- Network restrictions, MITM, and audit features are disabled
- Unless `HTTP_PROXY` / `HTTPS_PROXY` / `ANTHROPIC_BASE_URL` are set, traffic goes directly to the internet

## Related documents

- [aiya-tape.md](aiya-tape.md) — audit proxy (typically used alongside aiya-pit)
- [../README.md](../README.md) — overall architecture diagram and security model

## Open questions

- [ ] How to distribute the CA certificate (shared volume / init container / entrypoint script)
- [ ] Base image selection (ubuntu:24.04 / node:lts / custom)
- [ ] In-container user privileges (root vs non-root)
