/**
 * Shared testing utilities for Finsplain component tests.
 *
 * Exports:
 * - createMockDocument / createMockUser — typed mock data factories
 * - createMockSupabaseClient — a chainable Supabase client mock
 * - render — re-exported from @testing-library/react
 */

import React from "react";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";

export * from "@testing-library/react";

// ─── Data factories ───────────────────────────────────────────────────────────

export interface MockDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: "processing" | "complete" | "error";
  total_fees: number | null;
  subscriptions_found: number | null;
  unusual_activities: number | null;
  savings_identified: number | null;
  created_at: string;
}

export function createMockDocument(
  overrides: Partial<MockDocument> = {}
): MockDocument {
  return {
    id: "doc-1",
    filename: "bank-statement.pdf",
    file_type: "application/pdf",
    file_size: 512 * 1024, // 512 KB
    status: "complete",
    total_fees: 45.5,
    subscriptions_found: 3,
    unusual_activities: 1,
    savings_identified: 120,
    created_at: "2024-03-15T10:00:00Z",
    ...overrides,
  };
}

export interface MockUser {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
}

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: "user-123",
    email: "test@example.com",
    user_metadata: { full_name: "Test User", theme: "light" },
    ...overrides,
  };
}

// ─── Supabase mock factory ────────────────────────────────────────────────────

/**
 * Returns a Supabase-shaped mock that supports the common chaining patterns
 * used throughout the app:
 *   .from("table").insert(...)
 *   .from("table").select("id").eq(...).eq(...).order(...).limit(1)
 *   .from("table").update({...}).eq("id", id)
 *
 * Individual methods are jest.fn() so tests can assert on them or
 * override their resolved values.
 */
export function createMockSupabaseClient(
  userOverride: Partial<MockUser> | null = createMockUser()
) {
  // A re-usable terminal that resolves to success
  const resolved = { data: null, error: null };

  const limitMock = jest.fn().mockResolvedValue({ data: [{ id: "doc-1" }], error: null });
  const orderMock = jest.fn().mockReturnValue({ limit: limitMock });
  const eqAfterEqMock = jest.fn().mockReturnValue({ order: orderMock, eq: jest.fn().mockReturnValue({ order: orderMock }) });
  const eqMock = jest.fn().mockReturnValue({ eq: eqAfterEqMock, order: orderMock });
  const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
  const updateEqMock = jest.fn().mockResolvedValue(resolved);
  const updateMock = jest.fn().mockReturnValue({ eq: updateEqMock });
  // insert returns a builder that supports .select("id").single() chaining
  const insertSingleMock = jest.fn().mockResolvedValue({ data: { id: "doc-1" }, error: null });
  const insertSelectMock = jest.fn().mockReturnValue({ single: insertSingleMock });
  const insertMock = jest.fn().mockReturnValue({ select: insertSelectMock });

  const fromMock = jest.fn().mockReturnValue({
    insert: insertMock,
    select: selectMock,
    update: updateMock,
  });

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: userOverride },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      updateUser: jest.fn().mockResolvedValue({ data: {}, error: null }),
      refreshSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: "mock-token" } },
        error: null,
      }),
    },
    from: fromMock,
    // Expose individual mocks for assertions in tests
    _mocks: { fromMock, insertMock, selectMock, updateMock, eqMock, limitMock },
  };
}

// ─── Custom render ────────────────────────────────────────────────────────────

/**
 * A thin wrapper around RTL's render. Currently passes through without extra
 * providers because next-themes ThemeProvider is already mocked globally, but
 * this is a stable extension point for future providers (e.g., toast context).
 */
export function render(ui: React.ReactElement, options?: RenderOptions) {
  return rtlRender(ui, options);
}
