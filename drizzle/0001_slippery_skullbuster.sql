CREATE TABLE `membership` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`auto_renew` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `membership_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`membership_id` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`payment_status` varchar(50) NOT NULL DEFAULT 'pending',
	`transaction_id` varchar(255),
	`payment_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` varchar(50) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `status` varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `membership` ADD CONSTRAINT `membership_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_membership_id_membership_id_fk` FOREIGN KEY (`membership_id`) REFERENCES `membership`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `membership_user_id_idx` ON `membership` (`user_id`);--> statement-breakpoint
CREATE INDEX `payment_user_id_idx` ON `payment` (`user_id`);--> statement-breakpoint
CREATE INDEX `payment_membership_id_idx` ON `payment` (`membership_id`);