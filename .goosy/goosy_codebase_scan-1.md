# Codebase Security Scan #1

Scan Date: 1/26/2026, 3:16:45 AM
Total Files to Scan: 68

---

## File: src/components/link-card.jsx

**Lines of Code**: 253

### Vulnerability 1
- **Line**: 136
- **Type**: Open Redirect
- **Severity**: high
- **Description**: window.open(url?.original_url, '_blank') uses unvalidated user-controlled input, allowing for open redirect and potential phishing attacks. Validate or sanitize url.original_url before use.

---

## File: src/components/redirect-handler.jsx

**Lines of Code**: 53

### Vulnerability 1
- **Line**: 20
- **Type**: open redirect
- **Severity**: high
- **Description**: Unvalidated user-controlled data.original_url is used in window.location.href, allowing open redirect attacks. Validate or sanitize the URL before redirecting.

---

## File: src/pages/landing.jsx

**Lines of Code**: 490

### Vulnerability 1
- **Line**: 478
- **Type**: code injection
- **Severity**: high
- **Description**: Use of dangerouslySetInnerHTML with modalContent.content can lead to cross-site scripting (XSS) if modalContent.content is not properly sanitized.

---

## File: src/pages/link.jsx

**Lines of Code**: 670

### Vulnerability 1
- **Line**: 342
- **Type**: Open Redirect
- **Severity**: high
- **Description**: The href attribute is constructed using user-controlled data (link) without validation or sanitization, which could allow open redirect or XSS if link is not properly sanitized.

### Vulnerability 2
- **Line**: 354
- **Type**: Open Redirect
- **Severity**: high
- **Description**: The href attribute uses url?.original_url directly, which could allow open redirect or XSS if original_url is not properly sanitized.

### Vulnerability 3
- **Line**: 377
- **Type**: Arbitrary File Read
- **Severity**: medium
- **Description**: The src attribute of the img tag uses qrCodeUrl, which is derived from url?.qr. If not properly validated, this could allow loading of arbitrary images or data exfiltration.

---

