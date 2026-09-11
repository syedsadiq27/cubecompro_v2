DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'commerce') THEN
    CREATE USER commerce WITH PASSWORD 'commerce';
  END IF;
END
$$;

SELECT 'CREATE DATABASE commerce OWNER commerce'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'commerce')\gexec
