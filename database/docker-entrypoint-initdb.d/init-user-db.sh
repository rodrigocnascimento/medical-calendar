#!/bin/bash
set -e

psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f scripts/pg_dump.sql