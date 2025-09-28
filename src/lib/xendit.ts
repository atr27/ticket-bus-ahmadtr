import { Xendit } from 'xendit-node';

// Initialize Xendit client with secret key from environment variables
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});

export default xenditClient;

// Export specific modules we'll use
export const { Invoice } = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});
