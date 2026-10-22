-- Disposable local/test database only. Production credentials are installed separately.
CREATE ROLE sg_wedding LOGIN PASSWORD 'local-wedding-only';
ALTER DATABASE sg_wedding OWNER TO sg_wedding;
REVOKE CONNECT, TEMPORARY ON DATABASE sg_wedding FROM PUBLIC;
GRANT CONNECT, TEMPORARY ON DATABASE sg_wedding TO sg_wedding;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
-- Model the existing infrastructure marker, owned by the PostgreSQL administrator.
CREATE TABLE public.infrastructure_restore_probe (id integer PRIMARY KEY);
