// Export all TypeScript services
export { default as apiClient } from './api.service';
export { default as authService } from './auth.service.ts';
export { default as customerService } from './customer.service';
export { default as taxService } from './tax.service';
export { default as packageService } from './package.service';
export { default as quoteService } from './quote.service';
export { default as invoiceService } from './invoice.service';
export { default as paymentService } from './payment.service';

// Keep existing JS services for backward compatibility
// @ts-ignore
export { default as bookingService } from './booking.service';
// @ts-ignore
export { default as userService } from './user.service';
// @ts-ignore
export { default as villaService } from './villa.service';
// @ts-ignore
export { default as salesmanService } from './salesman.service';
// @ts-ignore
export { default as surveyService } from './survey.service';
// @ts-ignore
export { default as settingsService } from './settings.service';
