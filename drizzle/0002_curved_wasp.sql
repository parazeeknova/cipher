ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "player_id" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_player_id_unique" UNIQUE("player_id");