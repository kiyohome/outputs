# aiya-tape

> The tape is rolling — auditor

<!-- NOTE: The overall architecture diagram, security model, and monorepo layout are consolidated in ../README.md. -->

Records and visualizes all traffic from AI agents, so "what happened" is always retroactively auditable. aiya-tape consists of two components: **aiya-proxy** (a Go proxy that captures, controls, and ingests traffic) and **OpenObserve** (storage, querying, dashboards, and MCP).

## Quickstart

<!-- TODO: Steps from `docker compose up` to the dashboard -->

```
# TODO
```

## MCP integration

```bash
claude mcp add o2 http://localhost:5080/api/default/mcp \
  -t http --header "Authorization: Basic <TOKEN>"
```

OpenObserve's built-in MCP supports stream search, alert management, and more. No custom MCP server is needed.

## aiya-proxy

**Technology:** Go + goproxy

**Responsibilities:**

1. **API gateway** — swap `ANTHROPIC_BASE_URL` and record the full Anthropic API traffic (request/response, token counts, latency)
2. **HTTPS MITM** — use goproxy to record the payloads of all HTTPS traffic
3. **Domain allow/deny** — block connections to domains outside the allowlist
4. **Ingest to OpenObserve** — send records via its HTTP API
5. **Sensitive data masking** — mask `Authorization` headers, API keys, and similar before recording

### HTTPS MITM

With a plain CONNECT tunnel you only see the domain. "We don't know what it sent" is fatal for auditing suspicious outbound traffic.
→ MITM with a self-hosted CA certificate and record the full payload of every HTTPS request.

Security measures:

| Risk | Mitigation |
|---|---|
| CA private key leaks | Regenerated every container start, ephemeral |
| CC reaches the CA private key | Placed outside the working directory, permission-restricted |
| Credentials end up in logs | Masking for `Authorization` headers and similar |
| Certificate validation errors | Certificates configured per tool in the Dockerfile (on the aiya-pit side) |

Ethics: we record the traffic of AI agents *we ourselves run*. We do not intercept human traffic. Docker Sandboxes and Vercel AI Gateway follow the same practice.

### Recorded data

| Kind | Content |
|---|---|
| Anthropic API | request body, response body, model name, token counts, latency |
| General HTTPS | method, URL, status code, request/response size |
| Blocked | denied domain and the request content |

### docker-compose

```yaml
aiya-proxy:
  build: ./proxy
  ports: ["8080:8080"]
  environment:
    - O2_ENDPOINT=http://openobserve:5080
    - O2_USER=root@example.com
    - O2_PASS=xxx
  depends_on: [openobserve]
```

## OpenObserve

**Technology:** Rust single binary, AGPL-3.0 (no obligations for mere use)

**Why we picked it:**
1. Simple HTTP API for ingestion and querying
2. Built-in dashboards (no Grafana needed)
3. Official MCP server bundled → no custom MCP required
4. SQL-based querying
5. Single Docker image
6. 19+ chart types plus custom charts (ECharts)
7. Local disk storage supported

**Expected data volume:** a few MB to a few hundred MB per day. Well within the OSS edition's unlimited tier.

### docker-compose

```yaml
openobserve:
  image: public.ecr.aws/zinclabs/openobserve:latest
  ports: ["5080:5080"]
  volumes: [o2data:/data]
  environment:
    - ZO_DATA_DIR=/data
    - ZO_ROOT_USER_EMAIL=root@example.com
    - ZO_ROOT_USER_PASSWORD=xxx
```

## Single use (without aiya-pit)

aiya-tape can be used without the sandbox. In that mode:
- Point the host-side CC's `HTTP_PROXY` / `HTTPS_PROXY` at the proxy
- Point `ANTHROPIC_BASE_URL` at the proxy
- Filesystem isolation is disabled; only network auditing is active

## Related documents

- [aiya-pit](aiya-pit.md) — sandbox (typically used alongside aiya-tape)
- [AIYA README](../README.md) — overall architecture diagram and security model

## Open questions

- [ ] How to manage the proxy's domain allow/deny list (config file / env vars / API)
- [ ] Default dashboard presets (what the initial templates should show)
- [ ] Log retention (how to configure it)
- [ ] How to manage masking rules (regex-based / pattern match)
