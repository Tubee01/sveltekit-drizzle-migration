import {
  boolean,
  index,
  integer,
  pgSchema,
  serial,
  timestamp,
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
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (workspace) => {
    return {
      nameIndex: index("idx_workspace_name").on(workspace.name),
    };
  }
);

export const userWorkspace = coreSchema.table(
  "user_workspace",
  {
    workspaceId: integer("workspace_id").references(() => workspace.id),
    userId: integer("user_id").references(() => user.id),
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
