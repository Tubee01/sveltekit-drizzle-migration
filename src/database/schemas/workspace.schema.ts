import {
  uniqueIndex,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
  pgSchema,
} from "drizzle-orm/pg-core";
import { user } from "./core.schema";

export const currencyEnum = pgEnum("currency", ["EUR", "USD", "GBP", "HUF"]);

export const wallet = pgTable(
  "wallet",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    balance: integer("balance").default(0),
    currency: currencyEnum("currency").default("EUR"),
    isActive: boolean("is_active").default(true),
    isSavings: boolean("is_savings").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (wallet) => {
    return {
      uniqueNameIndex: uniqueIndex("idx_wallet_name_unique").on(wallet.name),
    };
  }
);

export const transaction = pgTable(
  "transaction",
  {
    id: serial("id").primaryKey(),
    walletId: integer("wallet_id").references(() => wallet.id),
    user_id: integer("user_id").references(() => user.id),
    amount: integer("amount").notNull(),
    transactionDate: timestamp("transaction_date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (transaction) => {
    return {
      walletIdIndex: index("idx_transaction_wallet_id").on(
        transaction.walletId
      ),
    };
  }
);

export const workspaceSchema = (schema: string) => {
  const workspaceSchema = pgSchema(schema);
  const wallet = workspaceSchema.table(
    "wallet",
    {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      balance: integer("balance").default(0),
      currency: currencyEnum("currency").default("EUR"),
      isActive: boolean("is_active").default(true),
      isSavings: boolean("is_savings").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (wallet) => {
      return {
        uniqueNameIndex: uniqueIndex("idx_wallet_name_unique").on(wallet.name),
      };
    }
  );
  const transaction = workspaceSchema.table(
    "transaction",
    {
      id: serial("id").primaryKey(),
      walletId: integer("wallet_id").references(() => wallet.id),
      amount: integer("amount").notNull(),
      transactionDate: timestamp("transaction_date").notNull(),
    },
    (transaction) => {
      return {
        walletIdIndex: index("idx_transaction_wallet_id").on(
          transaction.walletId
        ),
      };
    }
  );
  const logTransaction = workspaceSchema.table(
    "log_transaction",
    {
      id: serial("id").primaryKey(),
      transactionId: integer("transaction_id").references(() => transaction.id),
      userId: integer("user_id").references(() => user.id),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (logTransaction) => {
      return {
        logTransactionUniqueIndex: uniqueIndex("log_transaction_unique").on(
          logTransaction.transactionId,
          logTransaction.userId
        ),
      };
    }
  );

  return {
    wallet,
    transaction,
    logTransaction,
  };
};
