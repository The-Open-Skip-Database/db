CREATE TABLE `movies` (
	`tmdb_id` integer PRIMARY KEY NOT NULL,
	`outro_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` integer PRIMARY KEY NOT NULL,
	`tmdb_id` integer NOT NULL,
	`season` integer NOT NULL,
	`episode` integer NOT NULL,
	`intro_start` integer NOT NULL,
	`intro_end` integer NOT NULL,
	`outro_start` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movies_tmdb_id_unique` ON `movies` (`tmdb_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `series_id_unique` ON `series` (`id`);