# Xerpex ERP System - User Guide

## Table of Contents
1. [Introduction & Overview](#introduction--overview)
2. [Getting Started](#getting-started)
3. [Core Modules Documentation](#core-modules-documentation)
4. [Business Workflows](#business-workflows)
5. [User Interface Guide](#user-interface-guide)
6. [Role-Based Features](#role-based-features)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)

---

## Introduction & Overview

### What is Xerpex ERP

Xerpex ERP is a comprehensive Enterprise Resource Planning system specifically designed for service-based businesses, with particular strength in hospitality and tourism sectors. Built on modern Vue.js technology, Xerpex provides a complete Quotation-to-payment workflow solution that streamlines business operations from initial customer contact to final payment collection.

### Target Audience

Xerpex ERP is designed for:
- **Service-based businesses** requiring comprehensive customer and project management
- **Hospitality and tourism companies** managing bookings, villas, and packages
- **Small to medium enterprises** needing integrated financial management
- **Businesses with complex quoting processes** requiring approval workflows
- **Companies requiring multi-user collaboration** with role-based access control

### Key Benefits and Capabilities

- **Complete Business Workflow**: From Quotation creation to payment collection
- **Multi-User Environment**: Role-based access with user isolation and cross-user capabilities
- **Real-Time Updates**: Live status tracking and notifications
- **Professional Documentation**: Automated PDF generation for Quotations and invoices
- **Financial Integration**: Comprehensive payment tracking and reconciliation
- **Scalable Architecture**: Modern web-based system accessible from anywhere
- **Industry-Specific Features**: Villa management, booking systems, and package management

---

## Getting Started

### System Requirements

**Browser Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection for real-time features

**User Requirements:**
- Valid user account with appropriate role assignment
- Basic understanding of business processes
- Email access for notifications and document delivery

### Login Process and Authentication

1. **Access the System**
   - Navigate to your Xerpex ERP URL
   - Enter your username and password
   - Click "Sign In"

2. **First-Time Login**
   - You may be prompted to change your password
   - Verify your email address if required
   - Complete any required profile information

3. **Password Recovery**
   - Click "Forgot Password" on login screen
   - Enter your email address
   - Check email for reset instructions

### User Roles and Permissions

Xerpex ERP operates with three distinct user roles:

#### Regular Users
- **Data Isolation**: Can only access data they created (user_id isolation)
- **Core Functions**: Create and manage their own customers, Quotations, invoices
- **Limitations**: Cannot view other users' data or access financial reports

#### Finance Users
- **Cross-User Access**: Can view financial data across all users
- **Payment Management**: Full access to payment tracking and reconciliation
- **Financial Reporting**: Access to comprehensive financial reports
- **Invoice Oversight**: Can manage invoices created by any user

#### Admin Users
- **Full System Access**: Complete access to all data and functions
- **User Management**: Can create, modify, and deactivate user accounts
- **System Configuration**: Access to tax rates, system settings
- **Complete Oversight**: Can manage all aspects of the system

### Dashboard Overview

Upon login, users are presented with a personalized dashboard featuring:

- **Quick Stats**: Summary of active Quotations, pending invoices, recent payments
- **Recent Activity**: Latest actions and updates across your data
- **Pending Actions**: Items requiring your attention (approvals, follow-ups)
- **Navigation Menu**: Access to all system modules
- **Notifications**: Real-time alerts and system messages

---

## Core Modules Documentation

### Customer Management

#### Purpose
The Customer Management module serves as the foundation for all business relationships, storing comprehensive customer information and managing the complete customer lifecycle.

#### Key Features
- Complete customer profile management
- Contact information and communication history
- Customer status tracking (Active/Inactive)
- Integration with Quotations, invoices, and payments
- Search and filtering capabilities

#### Step-by-Step Workflows

**Creating a New Customer:**
1. Navigate to **Customers** from the main menu
2. Click **"Add New Customer"** button
3. Fill in required information:
   - Customer name (required)
   - Email address (required)
   - Phone number
   - Address details
   - Additional notes
4. Click **"Save Customer"**
5. Customer is created with "Active" status

**Managing Existing Customers:**
1. Go to **Customers** module
2. Use search bar or filters to find specific customers
3. Click on customer name to view full profile
4. Use **"Edit"** button to modify information
5. Use **"Deactivate"** to disable customer (preserves data)

**Customer Profile Features:**
- **Contact History**: View all Quotations, invoices, and payments
- **Communication Log**: Track emails and interactions
- **Status Management**: Activate/deactivate customers
- **Related Documents**: Quick access to all customer documents

### Quotation Management

#### Purpose
Quotation Management handles the creation, approval, and tracking of business proposals, serving as the starting point for most business transactions.

#### Key Features
- Professional Quotation creation with itemized details
- Multi-stage approval workflow
- PDF generation and email delivery
- Status tracking and expiration management
- Conversion to invoices

#### Workflow States
1. **Draft**: Quotation being prepared, not yet sent
2. **Sent**: Quotation delivered to customer, awaiting response
3. **Accepted**: Customer approved the Quotation
4. **Declined**: Customer rejected the Quotation
5. **Expired**: Quotation passed expiration date

#### Step-by-Step Workflows

**Creating a Quotation:**
1. Navigate to **Quotations** module
2. Click **"Create New Quotation"**
3. Select customer from dropdown (or create new)
4. Fill in Quotation details:
   - Quotation number (auto-generated)
   - Expiration date
   - Terms and conditions
5. Add line items:
   - Description of service/product
   - Quantity
   - Unit price
   - Tax rates (if applicable)
6. Review totals and calculations
7. Save as **Draft** or immediately **Send**

**Quotation Approval Process:**
1. **Draft Stage**: Internal review and modifications
2. **Send Quotation**: Generate PDF and email to customer
3. **Customer Review**: Customer evaluates proposal
4. **Response Handling**: 
   - If **Accepted**: Convert to invoice
   - If **Declined**: Archive or revise
   - If **Expired**: Follow up or create new Quotation

**PDF Generation and Delivery:**
1. From Quotation details, click **"Generate PDF"**
2. Review PDF preview
3. Click **"Send Email"** to deliver to customer
4. System tracks delivery and opens
5. Customer receives professional Quotation document

### Invoice Management

#### Purpose
Invoice Management handles billing processes, converting accepted Quotations into payable invoices and tracking payment collection.

#### Key Features
- Automatic creation from accepted Quotations
- Manual invoice creation
- Payment status tracking
- PDF generation and delivery
- Integration with payment management

#### Workflow States
1. **Draft**: Invoice being prepared
2. **Sent**: Invoice delivered to customer
3. **Partially Paid**: Some payment received
4. **Paid**: Full payment received
5. **Overdue**: Payment past due date

#### Step-by-Step Workflows

**Creating Invoice from Quotation:**
1. Navigate to accepted Quotation
2. Click **"Convert to Invoice"**
3. System automatically creates invoice with:
   - Same line items and pricing
   - Customer information
   - Payment terms
4. Review and modify if needed
5. Send to customer

**Manual Invoice Creation:**
1. Go to **Invoices** module
2. Click **"Create New Invoice"**
3. Select customer
4. Add invoice details and line items
5. Set payment terms and due date
6. Save and send

**Payment Tracking:**
1. View invoice status in invoices list
2. Record payments as received
3. System automatically updates status
4. Generate payment receipts
5. Track outstanding balances

### Payment Management

#### Purpose
Payment Management tracks all financial transactions, reconciles payments with invoices, and maintains comprehensive payment records.

#### Key Features
- Multiple payment method support
- Payment reconciliation with invoices
- Payment status tracking
- Receipt generation
- Financial reporting integration

#### Payment Methods Supported
- Cash payments
- Bank transfers
- Credit card payments
- Check payments
- Online payment gateways

#### Step-by-Step Workflows

**Recording a Payment:**
1. Navigate to **Payments** module
2. Click **"Record New Payment"**
3. Select customer and related invoice
4. Enter payment details:
   - Amount received
   - Payment method
   - Payment date
   - Reference number
5. System automatically updates invoice status
6. Generate receipt if needed

**Payment Reconciliation:**
1. Access **Payments** dashboard
2. View unreconciled payments
3. Match payments to invoices
4. Resolve discrepancies
5. Mark as reconciled

### Tax Management

#### Purpose
Tax Management handles tax rate configuration and automatic tax calculations across Quotations and invoices.

#### Key Features
- Multiple tax rate configuration
- Automatic tax calculations
- Tax reporting and compliance
- Regional tax support
- Tax exemption handling

#### Configuration Process
1. Navigate to **Settings** > **Tax Management**
2. Add tax rates:
   - Tax name (e.g., "VAT", "Sales Tax")
   - Tax percentage
   - Applicable regions
3. Set default tax rates
4. Configure tax exemptions

### Additional Modules

#### Salesmen Management
- **Purpose**: Track sales team performance and assign territories
- **Features**: Salesman profiles, territory assignment, performance tracking
- **Integration**: Link salesmen to customers and Quotations

#### Villa Management
- **Purpose**: Manage property inventory for hospitality businesses
- **Features**: Villa profiles, availability tracking, booking integration
- **Booking Integration**: Connect villas to booking system

#### Booking Management
- **Purpose**: Handle reservations and scheduling
- **Features**: Booking calendar, availability management, customer integration
- **Workflow**: Booking creation, confirmation, modification, cancellation

#### Package Management
- **Purpose**: Create and manage service packages
- **Features**: Package definition, pricing, availability
- **Integration**: Use packages in Quotations and invoices

---

## Business Workflows

### Complete Quotation-to-Payment Process

This is the core business workflow that most transactions follow:

#### Phase 1: Customer Setup
1. **Create Customer Profile**
   - Enter customer information
   - Verify contact details
   - Set customer preferences

#### Phase 2: Quotation Creation
2. **Prepare Quotation**
   - Select customer
   - Add services/products
   - Calculate pricing and taxes
   - Set terms and expiration

3. **Quotation Review and Approval**
   - Internal review (Draft stage)
   - Generate PDF preview
   - Make final adjustments

4. **Quotation Delivery**
   - Send PDF via email
   - Track delivery status
   - Monitor customer response

#### Phase 3: Quotation Response
5. **Customer Decision**
   - **If Accepted**: Proceed to invoicing
   - **If Declined**: Archive or revise
   - **If No Response**: Follow up before expiration

#### Phase 4: Invoice Generation
6. **Create Invoice**
   - Convert accepted Quotation to invoice
   - Set payment terms
   - Generate and send invoice

#### Phase 5: Payment Collection
7. **Payment Processing**
   - Monitor payment due dates
   - Record payments as received
   - Update invoice status
   - Generate receipts

8. **Completion**
   - Mark transaction as complete
   - Archive documents
   - Update customer history

### Customer Onboarding Workflow

#### Initial Contact
1. **Lead Capture**
   - Create customer record
   - Record initial contact information
   - Note source of lead

#### Qualification
2. **Customer Assessment**
   - Gather detailed requirements
   - Assess project scope
   - Determine service needs

#### Proposal
3. **Quotation Preparation**
   - Create detailed Quotation
   - Include all services and costs
   - Set competitive pricing

#### Conversion
4. **Close Deal**
   - Follow up on Quotation
   - Handle objections
   - Secure acceptance

### Invoice Generation and Payment Collection

#### Invoice Creation
1. **Generate Invoice**
   - From accepted Quotation or manual creation
   - Verify all details and pricing
   - Set payment terms

#### Delivery
2. **Send Invoice**
   - Email PDF to customer
   - Confirm receipt
   - Set follow-up reminders

#### Collection
3. **Payment Tracking**
   - Monitor due dates
   - Send payment reminders
   - Record payments promptly

#### Reconciliation
4. **Financial Reconciliation**
   - Match payments to invoices
   - Resolve discrepancies
   - Update financial records

---

## User Interface Guide

### Navigation Structure

#### Main Navigation Menu
- **Dashboard**: Overview and quick stats
- **Customers**: Customer management
- **Quotations**: Quotation creation and tracking
- **Invoices**: Invoice management
- **Payments**: Payment tracking
- **Reports**: Financial and business reports
- **Settings**: System configuration

#### Secondary Navigation
- **User Menu**: Profile, settings, logout
- **Notifications**: System alerts and messages
- **Search**: Global search functionality
- **Help**: Documentation and support

### Common UI Patterns

#### DataTable Component
The DataTable is used throughout the system for listing data:

**Features:**
- **Sorting**: Click column headers to sort
- **Filtering**: Use filter controls above table
- **Search**: Global search across all columns
- **Pagination**: Navigate through large datasets
- **Actions**: Row-level actions (edit, delete, view)

**Usage Tips:**
- Use column filters for specific searches
- Click row to view detailed information
- Use bulk actions for multiple items
- Export data using export buttons

#### Modal Windows
Used for creating and editing records:

**Features:**
- **Form Validation**: Real-time validation feedback
- **Save/Cancel**: Clear action buttons
- **Required Fields**: Marked with asterisks
- **Help Text**: Contextual guidance

#### Form Components
Consistent form elements across the system:

**Input Types:**
- Text inputs with validation
- Dropdown selectors
- Date pickers
- File upload areas
- Toggle switches
- Multi-select options

### Search and Filtering Capabilities

#### Global Search
- Available in top navigation
- Searches across customers, Quotations, invoices
- Provides quick access to any record

#### Module-Specific Filters
Each module provides targeted filtering:

**Customer Filters:**
- Status (Active/Inactive)
- Date range
- Customer type

**Quotation Filters:**
- Status (Draft, Sent, Accepted, etc.)
- Date range
- Customer
- Amount range

**Invoice Filters:**
- Payment status
- Due date range
- Customer
- Amount range

### Bulk Operations

Available in most data tables:

**Common Bulk Actions:**
- Delete multiple records
- Export selected data
- Update status for multiple items
- Send bulk emails

**Usage:**
1. Select items using checkboxes
2. Choose action from bulk actions menu
3. Confirm action in popup dialog

### Status Indicators and Color Coding

#### Quotation Status Colors
- **Gray**: Draft
- **Blue**: Sent
- **Green**: Accepted
- **Red**: Declined
- **Orange**: Expired

#### Invoice Status Colors
- **Gray**: Draft
- **Blue**: Sent
- **Yellow**: Partially Paid
- **Green**: Paid
- **Red**: Overdue

#### Payment Status Colors
- **Green**: Completed
- **Yellow**: Pending
- **Red**: Failed
- **Blue**: Processing

---

## Role-Based Features

### Regular Users

#### Capabilities
- **Customer Management**: Create and manage own customers
- **Quotation Creation**: Full Quotation creation and management
- **Invoice Management**: Create and track own invoices
- **Payment Recording**: Record payments for own invoices
- **Document Generation**: Create PDFs for own documents

#### Limitations
- **Data Isolation**: Can only see own data (user_id isolation)
- **No Cross-User Access**: Cannot view other users' customers or transactions
- **Limited Reporting**: Only personal performance reports
- **No System Administration**: Cannot modify system settings

#### Best Practices for Regular Users
- Keep customer information updated
- Follow up on Quotations promptly
- Record payments immediately upon receipt
- Use proper Quotation expiration dates
- Maintain organized filing system

### Finance Users

#### Enhanced Capabilities
- **Cross-User Financial Access**: View financial data from all users
- **Payment Oversight**: Manage payments across the organization
- **Financial Reporting**: Access comprehensive financial reports
- **Invoice Management**: Handle invoices from any user
- **Reconciliation**: Perform financial reconciliation tasks

#### Typical Responsibilities
- Monitor overall payment collection
- Generate financial reports
- Reconcile bank statements
- Handle payment discrepancies
- Oversee cash flow management

#### Finance User Workflows
1. **Daily Payment Review**
   - Check all payments received
   - Reconcile with bank deposits
   - Update invoice statuses

2. **Weekly Financial Reports**
   - Generate revenue reports
   - Review outstanding invoices
   - Analyze payment trends

3. **Monthly Reconciliation**
   - Reconcile all accounts
   - Generate month-end reports
   - Review aged receivables

### Admin Users

#### Full System Access
- **Complete Data Access**: View and modify all system data
- **User Management**: Create, modify, and deactivate users
- **System Configuration**: Modify tax rates, system settings
- **Advanced Reporting**: Access all reports and analytics
- **Data Maintenance**: Perform system maintenance tasks

#### Administrative Responsibilities
- **User Account Management**
  - Create new user accounts
  - Assign appropriate roles
  - Deactivate terminated users
  - Reset passwords when needed

- **System Configuration**
  - Set up tax rates
  - Configure email templates
  - Manage system settings
  - Update company information

- **Data Oversight**
  - Monitor system usage
  - Ensure data quality
  - Perform data cleanup
  - Manage system backups

#### Admin Best Practices
- Regularly review user access levels
- Monitor system performance
- Keep tax rates updated
- Maintain data backup procedures
- Document system changes

---

## Advanced Features

### Email Integration

#### Automated Email Features
- **Quotation Delivery**: Automatic PDF generation and email delivery
- **Invoice Delivery**: Professional invoice emails with PDF attachments
- **Payment Confirmations**: Automated receipt delivery
- **Reminder Systems**: Automated follow-up emails for overdue items

#### Email Templates
- **Customizable Templates**: Modify email content and branding
- **Professional Formatting**: Consistent, professional appearance
- **Dynamic Content**: Automatic insertion of customer and transaction details
- **Multi-Language Support**: Templates in multiple languages

#### Email Tracking
- **Delivery Confirmation**: Track email delivery status
- **Open Tracking**: Monitor when emails are opened
- **Link Tracking**: Track PDF downloads and link clicks
- **Response Management**: Handle email replies and responses

### PDF Generation and Export

#### Document Types
- **Professional Quotations**: Branded Quotation documents with terms
- **Detailed Invoices**: Comprehensive invoice with payment terms
- **Payment Receipts**: Official payment confirmation documents
- **Financial Reports**: Formatted reports for analysis

#### PDF Features
- **Professional Branding**: Company logo and branding
- **Detailed Line Items**: Complete service/product descriptions
- **Tax Calculations**: Automatic tax computation and display
- **Terms and Conditions**: Legal terms and payment conditions
- **Digital Signatures**: Electronic signature capabilities

#### Export Options
- **Individual Documents**: Single PDF generation
- **Batch Export**: Multiple documents at once
- **Report Export**: Financial reports in PDF format
- **Data Export**: CSV/Excel export for analysis

### Real-Time Updates and Notifications

#### Live Status Updates
- **Quotation Status Changes**: Real-time status updates
- **Payment Notifications**: Immediate payment confirmations
- **System Alerts**: Important system messages
- **User Activity**: Live activity feeds

#### Notification Types
- **Email Notifications**: Important updates via email
- **In-App Notifications**: Browser-based notifications
- **Dashboard Alerts**: Prominent dashboard notifications
- **Mobile Notifications**: Push notifications for mobile users

#### Notification Settings
- **Customizable Preferences**: Choose notification types
- **Frequency Settings**: Control notification frequency
- **Priority Levels**: Set importance levels
- **Quiet Hours**: Schedule notification-free periods

### Error Handling and Troubleshooting

#### Common Issues and Solutions

**Login Problems:**
- **Issue**: Cannot log in
- **Solution**: Check username/password, clear browser cache, contact admin

**Data Not Saving:**
- **Issue**: Changes not being saved
- **Solution**: Check internet connection, refresh page, try again

**PDF Generation Fails:**
- **Issue**: PDF not generating
- **Solution**: Check browser settings, disable popup blockers, try different browser

**Email Not Sending:**
- **Issue**: Emails not being delivered
- **Solution**: Check email addresses, verify email settings, contact support

#### Error Prevention
- **Regular Backups**: Automatic data backup procedures
- **Input Validation**: Prevent invalid data entry
- **Session Management**: Automatic session timeout handling
- **Data Integrity**: Automatic data validation and correction

#### Support Resources
- **Help Documentation**: Comprehensive help system
- **Video Tutorials**: Step-by-step video guides
- **Support Tickets**: Direct support contact system
- **User Community**: User forums and knowledge sharing

---

## Best Practices

### Recommended Workflows

#### Daily Operations
1. **Start of Day**
   - Check dashboard for urgent items
   - Review notifications and alerts
   - Check pending Quotations and invoices

2. **Customer Interactions**
   - Update customer information immediately
   - Record all communications
   - Follow up on pending items promptly

3. **End of Day**
   - Record any payments received
   - Update Quotation and invoice statuses
   - Plan follow-up activities

#### Weekly Reviews
1. **Quotation Management**
   - Review all pending Quotations
   - Follow up on Quotations nearing expiration
   - Convert accepted Quotations to invoices

2. **Invoice Management**
   - Review overdue invoices
   - Send payment reminders
   - Update payment statuses

3. **Customer Relationship Management**
   - Review customer interactions
   - Plan customer outreach
   - Update customer preferences

### Data Management Tips

#### Data Quality
- **Consistent Formatting**: Use consistent formats for names, addresses, phone numbers
- **Complete Information**: Fill in all relevant fields
- **Regular Updates**: Keep customer information current
- **Data Validation**: Double-check important information before saving

#### Organization Strategies
- **Naming Conventions**: Use consistent naming for Quotations and invoices
- **Categorization**: Use customer types and categories effectively
- **Documentation**: Add notes and comments for future reference
- **File Management**: Organize related documents together

#### Backup and Recovery
- **Regular Exports**: Export important data regularly
- **Document Storage**: Keep copies of important documents
- **Version Control**: Track changes to important records
- **Recovery Planning**: Know how to recover from data loss

### Security Considerations

#### Password Security
- **Strong Passwords**: Use complex passwords with mixed characters
- **Regular Updates**: Change passwords regularly
- **Unique Passwords**: Don't reuse passwords from other systems
- **Two-Factor Authentication**: Enable when available

#### Data Protection
- **Access Control**: Only access data you need for your role
- **Screen Locking**: Lock screen when away from computer
- **Secure Networks**: Use secure internet connections
- **Data Sharing**: Follow company policies for data sharing

#### Privacy Compliance
- **Customer Privacy**: Protect customer information appropriately
- **Data Retention**: Follow data retention policies
- **Access Logging**: Understand that system access is logged
- **Compliance Requirements**: Follow industry-specific regulations

### Performance Optimization

#### System Performance
- **Browser Maintenance**: Keep browser updated and clear cache regularly
- **Internet Connection**: Use stable, high-speed internet connection
- **Multiple Tabs**: Limit number of open browser tabs
- **System Resources**: Ensure adequate computer memory and processing power

#### Workflow Efficiency
- **Keyboard Shortcuts**: Learn and use keyboard shortcuts
- **Bulk Operations**: Use bulk actions for multiple items
- **Templates**: Create templates for common Quotations and invoices
- **Automation**: Use automated features where available

#### Time Management
- **Batch Processing**: Group similar tasks together
- **Priority Management**: Focus on high-priority items first
- **Regular Schedules**: Establish regular routines for common tasks
- **Follow-up Systems**: Use systematic follow-up procedures

---

## Conclusion

Xerpex ERP provides a comprehensive solution for managing service-based businesses from initial customer contact through final payment collection. By following the workflows, best practices, and guidelines outlined in this user guide, you can maximize the system's effectiveness and streamline your business operations.

For additional support, training, or questions not covered in this guide, please contact your system administrator or the Xerpex support team.

---

*This user guide is designed to be a living document. Please provide feedback and suggestions for improvements to help make this resource more valuable for all users.*