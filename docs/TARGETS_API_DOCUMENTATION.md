# Targets API Documentation

## 1. Header and Overview

### Title
**XerpeX ERP System - Targets Management API**

### Brief Description
The Targets API provides comprehensive sales performance tracking and target management functionality for the XerpeX ERP system. It enables administrators to set monthly sales targets for sales personnel and track achievements based on invoice revenue, with automatic carry-over mechanisms for unmet targets.

### Authentication Requirements Overview
- **Admin Endpoints**: Require admin role authentication using JWT Bearer tokens
- **General Endpoints**: Require user authentication (sales users for personal performance, all users for company-wide data)
- **Token Format**: `Authorization: Bearer <jwt_token>`

### Base URL Information
```
Base URL: /api/v1
Admin Routes: /api/v1/admin/targets
General Routes: /api/v1/targets
```

## 2. Endpoints Documentation

### Admin Endpoints (Admin Only)

#### 1. Set Monthly Target
**Endpoint:** `POST /admin/targets`  
**Priority:** Medium (Admin Dashboard)  
**Description:** Set monthly sales target for a sales user with automatic carry-over calculation

**Request:**
```json
{
  "user_id": 1,
  "year": 2024,
  "month": 10,
  "target_amount": 1500000.00
}
```

**Response (201):**
```json
{
  "message": "Target set successfully",
  "adjusted_target": 1550000.00
}
```

**Authentication:** Admin JWT token required  
**Error Responses:** 403 (Forbidden), 422 (Validation Error), 500 (Server Error)

#### 2. Get All Targets
**Endpoint:** `GET /admin/targets`  
**Priority:** Low (Admin Management)  
**Description:** Retrieve all sales targets across the system

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "year": 2024,
    "month": 9,
    "target_amount": 1000000.00,
    "carried_over_amount": 0.00,
    "adjusted_target_amount": 1000000.00,
    "created_at": "2024-09-01T00:00:00Z",
    "updated_at": "2024-09-01T00:00:00Z"
  }
]
```

**Authentication:** Admin JWT token required  
**Error Responses:** 403 (Forbidden), 500 (Server Error)

#### 3. Update Target
**Endpoint:** `PUT /admin/targets/{target_id}`  
**Priority:** Low (Admin Management)  
**Description:** Update an existing sales target

**Request:**
```json
{
  "target_amount": 2000000.00
}
```

**Response (200):** Returns updated target object  
**Authentication:** Admin JWT token required  
**Error Responses:** 403 (Forbidden), 404 (Not Found), 500 (Server Error)

#### 4. Delete Target
**Endpoint:** `DELETE /admin/targets/{target_id}`  
**Priority:** Low (Admin Management)  
**Description:** Delete a specific sales target

**Response (200):**
```json
{
  "message": "Target deleted successfully"
}
```

**Authentication:** Admin JWT token required  
**Error Responses:** 403 (Forbidden), 404 (Not Found), 500 (Server Error)

#### 5. Get Targets Overview
**Endpoint:** `GET /admin/targets/overview`  
**Priority:** High (Admin Dashboard)  
**Description:** Get comprehensive targets overview with charts and metrics

**Response (200):**
```json
{
  "total_yearly_target": 12000000.00,
  "current_month_achievement": 850000.00,
  "achievement_percentage": 70.83,
  "monthly_data": [...],
  "chart_data": [...],
  "ytd_metrics": {
    "ytd_target": 9000000.00,
    "ytd_achievement": 6500000.00,
    "ytd_percentage": 72.22
  },
  "active_users_count": 5,
  "top_performers": [...]
}
```

**Authentication:** Admin JWT token required  
**Error Responses:** 401 (Unauthorized), 500 (Server Error)

### General Endpoints (Frontend Priority)

#### 6. Get My Performance **[HIGH PRIORITY]**
**Endpoint:** `GET /targets/my-performance?year={year}`  
**Priority:** High (Sales Dashboard)  
**Description:** Get current user's sales performance data for the specified year

**Parameters:**
- `year` (optional): Year to fetch data for (defaults to current year)

**Response (200):**
```json
{
  "user_id": 1,
  "year": 2024,
  "monthly_targets": [
    {
      "month": 9,
      "target_amount": 1000000.00,
      "carried_over": 0.00,
      "adjusted_target": 1000000.00
    }
  ],
  "monthly_achievements": [
    {
      "month": 9,
      "achieved_amount": 850000.00,
      "target_amount": 1000000.00,
      "percentage": 85.00
    }
  ],
  "total_achievement": 850000.00,
  "achievement_percentage": 85.00
}
```

**Authentication:** Sales user JWT token required  
**Error Responses:** 401 (Unauthorized), 403 (Not Sales User), 500 (Server Error)

#### 7. Get Company Performance **[HIGH PRIORITY]**
**Endpoint:** `GET /targets/company-performance?year={year}`  
**Priority:** High (Company Dashboard)  
**Description:** Get company-wide performance data

**Parameters:**
- `year` (optional): Year to fetch data for (defaults to current year)

**Response (200):**
```json
{
  "year": 2024,
  "total_yearly_target": 12000000.00,
  "total_achievement": 9500000.00,
  "achievement_percentage": 79.17
}
```

**Authentication:** Any authenticated user  
**Error Responses:** 401 (Unauthorized), 500 (Server Error)

#### 8. Get User Performance Chart **[HIGH PRIORITY]**
**Endpoint:** `GET /targets/user-performances?year={year}&user_id={user_id}`  
**Priority:** High (Charts/Dashboard)  
**Description:** Get user performance data formatted for chart visualization

**Parameters:**
- `year` (required): Year for performance data
- `user_id` (optional): Specific user ID filter, returns all users if not provided

**Response (200):**
```json
{
  "year": 2024,
  "chart_data": {
    "labels": ["John Doe", "Jane Smith", "Bob Wilson"],
    "datasets": [
      {
        "label": "Target Amount",
        "data": [1000000, 1200000, 800000],
        "backgroundColor": "rgba(54, 162, 235, 0.5)",
        "borderColor": "rgba(54, 162, 235, 1)"
      },
      {
        "label": "Achieved Amount",
        "data": [950000, 1100000, 750000],
        "backgroundColor": "rgba(75, 192, 192, 0.5)",
        "borderColor": "rgba(75, 192, 192, 1)"
      }
    ]
  },
  "users": [
    {
      "user_id": 1,
      "username": "johndoe",
      "full_name": "John Doe",
      "target_amount": 1000000.00,
      "achieved_amount": 950000.00,
      "achievement_percentage": 95.00,
      "months_with_data": 9
    }
  ],
  "total_users": 3,
  "generated_at": "2024-09-07T11:50:53Z"
}
```

**Authentication:** Any authenticated user  
**Error Responses:** 401 (Unauthorized), 500 (Server Error)

## 3. Response Schemas

### TargetResponse Schema
```json
{
  "id": "integer",
  "user_id": "integer",
  "year": "integer",
  "month": "integer",
  "target_amount": "number (decimal)",
  "carried_over_amount": "number (decimal)",
  "adjusted_target_amount": "number (decimal)",
  "created_at": "string (ISO datetime)",
  "updated_at": "string (ISO datetime)"
}
```

### MyPerformance Schema
```json
{
  "user_id": "integer",
  "year": "integer",
  "monthly_targets": [
    {
      "month": "integer",
      "target_amount": "number",
      "carried_over": "number",
      "adjusted_target": "number"
    }
  ],
  "monthly_achievements": [
    {
      "month": "integer",
      "achieved_amount": "number",
      "target_amount": "number",
      "percentage": "number"
    }
  ],
  "total_achievement": "number",
  "achievement_percentage": "number"
}
```

### CompanyPerformance Schema
```json
{
  "year": "integer",
  "total_yearly_target": "number",
  "total_achievement": "number",
  "achievement_percentage": "number"
}
```

### UserPerformanceChart Schema (Chart-Ready)
```json
{
  "year": "integer",
  "chart_data": {
    "labels": ["string"],
    "datasets": [
      {
        "label": "string",
        "data": ["number"],
        "backgroundColor": "string",
        "borderColor": "string"
      }
    ]
  },
  "users": [
    {
      "user_id": "integer",
      "username": "string",
      "full_name": "string|null",
      "target_amount": "number",
      "achieved_amount": "number",
      "achievement_percentage": "number",
      "months_with_data": "integer"
    }
  ],
  "total_users": "integer",
  "generated_at": "string (ISO datetime)"
}
```

### TargetOverview Schema (Admin Dashboard)
```json
{
  "total_yearly_target": "number",
  "current_month_achievement": "number",
  "achievement_percentage": "number",
  "monthly_data": [
    {
      "month": "integer",
      "month_name": "string",
      "target_amount": "number",
      "achieved_amount": "number",
      "achievement_percentage": "number",
      "carried_over_amount": "number"
    }
  ],
  "chart_data": [
    {
      "month": "integer",
      "month_name": "string",
      "target": "number",
      "achievement": "number"
    }
  ],
  "ytd_metrics": {
    "ytd_target": "number",
    "ytd_achievement": "number",
    "ytd_percentage": "number"
  },
  "active_users_count": "integer",
  "top_performers": [
    {
      "user_id": "integer",
      "username": "string",
      "full_name": "string|null",
      "total_achievement": "number",
      "achievement_percentage": "number"
    }
  ]
}
```

## 4. Frontend Integration Guide

### Authentication Flow
```javascript
// 1. Login to get JWT token
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { access_token } = await loginResponse.json();

// 2. Store token
localStorage.setItem('token', access_token);

// 3. Use token for authenticated requests
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

### Error Handling Patterns
```javascript
const handleApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
      return;
    }

    if (response.status === 403) {
      // Forbidden - show appropriate message
      showError('You do not have permission to access this resource');
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showError(error.message);
  }
};
```

### Chart Integration Examples

#### Bar Chart Integration (Chart.js)
```javascript
// Fetch performance chart data
const chartData = await handleApiCall('/api/v1/targets/user-performances?year=2024');

// Create chart
const ctx = document.getElementById('performanceChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: chartData.chart_data,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
    }
  }
});
```

#### Performance Dashboard Component
```javascript
const PerformanceDashboard = () => {
  const [performance, setPerformance] = useState(null);
  const [companyPerf, setCompanyPerf] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [myPerf, compPerf] = await Promise.all([
        handleApiCall('/api/v1/targets/my-performance'),
        handleApiCall('/api/v1/targets/company-performance')
      ]);

      setPerformance(myPerf);
      setCompanyPerf(compPerf);
    };

    loadData();
  }, []);

  return (
    <div className="dashboard">
      <div className="metric-card">
        <h3>My Achievement</h3>
        <div className="percentage">
          {performance?.achievement_percentage.toFixed(1)}%
        </div>
        <div className="amount">
          Rp {performance?.total_achievement?.toLocaleString('id-ID')}
        </div>
      </div>

      <div className="metric-card">
        <h3>Company Achievement</h3>
        <div className="percentage">
          {companyPerf?.achievement_percentage.toFixed(1)}%
        </div>
        <div className="amount">
          Rp {companyPerf?.total_achievement?.toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
};
```

### Real-time Considerations
- **Data Freshness**: Performance data is calculated from invoice payments
- **Caching Strategy**: Consider caching chart data for 5-15 minutes
- **Update Triggers**: Refresh data after invoice status changes
- **Loading States**: Show loading indicators during API calls

## 5. Business Logic Notes

### Achievement Calculation Methods
- **Source**: Calculated from paid invoices (`status = 'paid'`)
- **Revenue Basis**: Sum of `invoice.total` for sales person's invoices
- **Time Frame**: Monthly aggregation based on `issue_date`
- **Currency**: All amounts in Indonesian Rupiah (IDR)

### Carry-over Mechanism
- **Trigger**: When monthly achievement < adjusted target
- **Calculation**: `unmet = adjusted_target - achieved_amount`
- **Carry-forward**: Unmet amount added to next month's target
- **Reset**: No carry-over at year-end (December to January)

### Role-based Access Patterns
- **Admin**: Full CRUD operations on targets, access to all performance data
- **Sales Users**: Read-only access to personal performance data
- **Other Users**: Read-only access to company-wide performance data
- **Authentication**: JWT-based with role validation

### Sample Data Examples

#### Monthly Performance Data
```json
{
  "user_id": 1,
  "year": 2024,
  "monthly_targets": [
    {
      "month": 9,
      "target_amount": 1000000.00,
      "carried_over": 50000.00,
      "adjusted_target": 1050000.00
    },
    {
      "month": 10,
      "target_amount": 1200000.00,
      "carried_over": 0.00,
      "adjusted_target": 1200000.00
    }
  ],
  "monthly_achievements": [
    {
      "month": 9,
      "achieved_amount": 950000.00,
      "target_amount": 1050000.00,
      "percentage": 90.48
    },
    {
      "month": 10,
      "achieved_amount": 1100000.00,
      "target_amount": 1200000.00,
      "percentage": 91.67
    }
  ],
  "total_achievement": 2050000.00,
  "achievement_percentage": 91.11
}
```

#### Chart Data Sample
```json
{
  "year": 2024,
  "chart_data": {
    "labels": ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"],
    "datasets": [
      {
        "label": "Target Amount",
        "data": [1000000, 1200000, 800000, 950000],
        "backgroundColor": "rgba(54, 162, 235, 0.5)",
        "borderColor": "rgba(54, 162, 235, 1)"
      },
      {
        "label": "Achieved Amount",
        "data": [950000, 1100000, 750000, 900000],
        "backgroundColor": "rgba(75, 192, 192, 0.5)",
        "borderColor": "rgba(75, 192, 192, 1)"
      }
    ]
  },
  "users": [
    {
      "user_id": 1,
      "username": "johndoe",
      "full_name": "John Doe",
      "target_amount": 1000000.00,
      "achieved_amount": 950000.00,
      "achievement_percentage": 95.00,
      "months_with_data": 9
    }
  ],
  "total_users": 4,
  "generated_at": "2024-09-07T11:50:53Z"
}
```

This documentation provides comprehensive guidance for frontend developers to integrate with the Targets API, including authentication, error handling, chart integration, and understanding of the underlying business logic.