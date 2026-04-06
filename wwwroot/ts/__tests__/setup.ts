import { vi } from 'vitest';

// Mock electron IPC - used by SharedMemorySupplier and other modules
vi.mock('electron', () => ({
  ipcRenderer: {
    send: vi.fn(),
    on: vi.fn(),
    invoke: vi.fn(),
  },
}));
