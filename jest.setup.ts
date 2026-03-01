import "@testing-library/jest-dom";

// Mock window.matchMedia (required by Radix UI and next-themes)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (required by some Radix UI components)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver (required by HowItWorksDemo)
// Tests that need to trigger intersection manually can override this per-file.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock next/navigation globally — tests can override per-file with jest.mocked()
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue("/"),
  redirect: jest.fn(),
}));

// Mock next-themes globally
jest.mock("next-themes", () => ({
  useTheme: jest
    .fn()
    .mockReturnValue({ theme: "light", setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock react-dom useFormStatus (used by SubmitButton in every form)
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn().mockReturnValue({ pending: false }),
}));

// Mock React useActionState (React 19 — used by SignInForm)
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest
    .fn()
    .mockImplementation((_action: unknown, initialState: unknown) => [
      initialState,
      jest.fn(),
      false,
    ]),
}));
