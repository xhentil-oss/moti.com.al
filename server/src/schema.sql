-- Schema për moti.com.al (MariaDB / MySQL)
-- Emrat e kolonave janë identikë me fushat e frontend-it (camelCase) me qëllim
-- që translator-i i query-ve dhe mapping-u i rreshtave të mbeten të thjeshtë.

CREATE TABLE IF NOT EXISTS `locations` (
  `id`         VARCHAR(120)  NOT NULL,
  `name`       VARCHAR(160)  NOT NULL,
  `nameAl`     VARCHAR(160)  NOT NULL,
  `region`     VARCHAR(160)  NOT NULL,
  `country`    VARCHAR(64)   NOT NULL,
  `lat`        DOUBLE        NOT NULL,
  `lon`        DOUBLE        NOT NULL,
  `population` INT           NOT NULL DEFAULT 0,
  `isPopular`  TINYINT(1)    NOT NULL DEFAULT 0,
  `createdAt`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_country` (`country`),
  KEY `idx_population` (`population`),
  KEY `idx_isPopular` (`isPopular`),
  KEY `idx_name` (`name`),
  KEY `idx_nameAl` (`nameAl`),
  KEY `idx_region` (`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Përdorues admin (opsionale — auth mund të bëhet edhe vetëm nga ENV).
-- E mbajmë për zgjerim të ardhshëm me shumë administratorë.
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`           INT           NOT NULL AUTO_INCREMENT,
  `username`     VARCHAR(64)   NOT NULL,
  `passwordHash` VARCHAR(255)  NOT NULL,
  `createdAt`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
