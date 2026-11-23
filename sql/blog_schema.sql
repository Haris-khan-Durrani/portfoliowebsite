-- ============================================================================
-- MySQL Schema for Haris Khan Durrani Portfolio Blog & Media Server
-- Compatible with MySQL 8.0+ / MariaDB 10.6+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `hkd_portfolio`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hkd_portfolio`;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(190) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(320) DEFAULT NULL,
  `excerpt` TEXT NOT NULL,
  `tldr_answer` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Solution Architecture',
  `cover_image` VARCHAR(255) DEFAULT '/assets/proposal.jpg',
  `reading_time_minutes` INT UNSIGNED NOT NULL DEFAULT 6,
  `tags` JSON NOT NULL,
  `key_takeaways` JSON NOT NULL,
  `faqs` JSON NOT NULL,
  `comparison_table` JSON DEFAULT NULL,
  `geo_entities` JSON DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(320) DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `author_name` VARCHAR(120) NOT NULL DEFAULT 'Haris Khan Durrani',
  `author_role` VARCHAR(180) NOT NULL DEFAULT 'Head of IT | Senior Full-Stack Developer | Solution Architect',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `published_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_posts_slug` (`slug`),
  KEY `idx_blog_posts_category` (`category`),
  KEY `idx_blog_posts_published` (`published`, `published_at`),
  FULLTEXT KEY `ft_blog_search` (`title`, `excerpt`, `tldr_answer`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size_bytes` INT UNSIGNED NOT NULL DEFAULT 0,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_media_filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
