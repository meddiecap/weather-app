CREATE TABLE `geo_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`open_weather_id` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`lat` text NOT NULL,
	`lon` text NOT NULL,
	`country` text NOT NULL,
	`country_code` text NOT NULL,
	`state` text NOT NULL,
	`timezone` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
