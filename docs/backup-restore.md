# Backup and Restore

Create a database backup:

```bash
./scripts/backup-db.sh
```

Restore a backup:

```bash
./scripts/restore-db.sh backups/plusmit-YYYYMMDD-HHMMSS.dump
```

The restore script requires typing `RESTORE`.

Media uploads are stored in the Docker `media` volume. Back up that volume alongside PostgreSQL dumps.

Suggested retention:

- Daily backups for 7 days
- Weekly backups for 4 weeks
- Monthly backups for 6 months
