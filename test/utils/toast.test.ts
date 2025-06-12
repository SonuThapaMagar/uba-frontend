import { showToast } from '../../src/utils/toast';
import { toast } from 'react-toastify';

// Mock react-toastify to spy on its methods
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

describe('showToast utility', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  it('should call toast.success when showToast.success is invoked', () => {
    const message = 'Success message!';
    showToast.success(message);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(message);
  });

  it('should call toast.error when showToast.error is invoked', () => {
    const message = 'Error message!';
    showToast.error(message);
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it('should call toast.info when showToast.info is invoked', () => {
    const message = 'Info message!';
    showToast.info(message);
    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith(message);
  });

  it('should call toast.warning when showToast.warning is invoked', () => {
    const message = 'Warning message!';
    showToast.warning(message);
    expect(toast.warning).toHaveBeenCalledTimes(1);
    expect(toast.warning).toHaveBeenCalledWith(message);
  });
}); 