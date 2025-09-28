CREATE TABLE "alarms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"action" varchar(50) NOT NULL,
	"trigger" text NOT NULL,
	"description" text,
	"summary" text,
	"attendee" varchar(255),
	"attach" text,
	"repeat" integer,
	"duration" varchar(100),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"cn" varchar(255),
	"role" varchar(50),
	"partstat" varchar(50),
	"rsvp" boolean,
	"cutype" varchar(50),
	"delegated_to" varchar(255),
	"delegated_from" varchar(255),
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calendar_id" uuid NOT NULL,
	"uid" varchar(255) NOT NULL,
	"type" varchar(20) DEFAULT 'VEVENT' NOT NULL,
	"summary" text,
	"description" text,
	"location" text,
	"status" varchar(50),
	"dtstart" timestamp with time zone,
	"dtend" timestamp with time zone,
	"duration" varchar(100),
	"dtstamp" timestamp with time zone,
	"created" timestamp with time zone DEFAULT now(),
	"last_modified" timestamp with time zone DEFAULT now(),
	"sequence" integer DEFAULT 0,
	"priority" integer,
	"class" varchar(50),
	"transp" varchar(50),
	"organizer" varchar(255),
	"categories" jsonb,
	"rrule" text,
	"exdate" jsonb,
	"rdate" jsonb,
	"geo_lat" numeric(10, 8),
	"geo_lon" numeric(11, 8),
	"resources" jsonb,
	"url" text,
	"contact" text,
	"percent_complete" integer,
	"completed" timestamp with time zone,
	"due" timestamp with time zone,
	"related_to" varchar(255),
	"freebusy" jsonb,
	"custom_properties" jsonb,
	"timezone" varchar(100),
	"is_occurrence" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "calendar_events_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#3b82f6',
	"timezone" varchar(100) DEFAULT 'UTC',
	"is_default" boolean DEFAULT false,
	"is_visible" boolean DEFAULT true,
	"calendar_type" varchar(50) DEFAULT 'personal',
	"external_id" varchar(255),
	"external_source" varchar(50),
	"sync_enabled" boolean DEFAULT false,
	"last_sync_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_event_id_calendar_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_calendar_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;