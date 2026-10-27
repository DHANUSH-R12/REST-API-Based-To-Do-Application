CREATE DATABASE IF NOT EXISTS todo_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todo_app;

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tasks_completed (completed),
  INDEX idx_tasks_created_at (created_at)
);
