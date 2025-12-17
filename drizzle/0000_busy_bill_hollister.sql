CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider", "providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"agent_name" text,
	"user_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId", "credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pastes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text NOT NULL,
	"content_type" text DEFAULT 'text/plain',
	"syntax" text,
	"visibility" text DEFAULT 'public',
	"author_id" text,
	"session_id" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pastes_to_tags" (
	"paste_id" text,
	"tag_id" text,
	CONSTRAINT "pastes_to_tags_paste_id_tag_id_pk" PRIMARY KEY("paste_id", "tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"description" text,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier", "token")
);
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "account"
ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "agent_sessions"
ADD CONSTRAINT "agent_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "authenticator"
ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "pastes"
ADD CONSTRAINT "pastes_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE
set null ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "pastes"
ADD CONSTRAINT "pastes_session_id_agent_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."agent_sessions"("id") ON DELETE
set null ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "pastes_to_tags"
ADD CONSTRAINT "pastes_to_tags_paste_id_pastes_id_fk" FOREIGN KEY ("paste_id") REFERENCES "public"."pastes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "pastes_to_tags"
ADD CONSTRAINT "pastes_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
ALTER TABLE "session"
ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
WHEN duplicate_object THEN null;
END $$;