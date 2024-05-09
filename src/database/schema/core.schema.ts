import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgSchema,
  serial,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
export const coreSchema = pgSchema("core");

export const user = coreSchema.table(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (user) => {
    return {
      emailIndex: index("idx_user_email").on(user.email),
    };
  },
);

export const workspace = coreSchema.table(
  "workspace",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    ownerId: integer("owner_id").references(() => user.id).notNull(),
  },
  (workspace) => {
    return {
      nameIndex: index("idx_workspace_name").on(workspace.name),
      uniqueNameOwnerIndex: uniqueIndex("idx_uq_workspace_name_owner").on(
        workspace.name,
        workspace.ownerId
      ),
    };
  }
);

export const userWorkspace = coreSchema.table(
  "user_workspace",
  {
    workspaceId: uuid("workspace_id").references(() => workspace.id),
    userId: integer("user_id").references(() => user.id).notNull(),
    isAdmin: boolean("is_admin").default(false),
  },
  (userWorkspace) => {
    return {
      userWorkspaceUniqueIndex: index("user_workspace_unique").on(
        userWorkspace.workspaceId,
        userWorkspace.userId
      ),
    };
  }
);
