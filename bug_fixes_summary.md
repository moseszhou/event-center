# Bug Fixes Summary - yum-event-center

This document details the 3 critical bugs found and fixed in the yum-event-center event management library.

## Bug #1: Logic Error in `once()` method

### **Problem Description**
The `once()` method was missing a return statement, which caused it to return `undefined` instead of a listener object with a `remove()` method. This made the method inconsistent with `addEventListener()` and caused runtime errors when users tried to call `.remove()` on the returned value.

### **Location**: 
- `index.cjs` lines 46-58
- `index.mjs` lines 46-58

### **Impact**
- **Severity**: High
- **Type**: Logic Error
- Users couldn't remove one-time event listeners
- Code examples in README.md would fail with `TypeError: Cannot read property 'remove' of undefined`
- Inconsistent API behavior between `addEventListener()` and `once()`

### **Root Cause**
The method created a `remove` function internally but never returned it to the caller.

### **Fix Applied**
Added a return statement to provide a listener object with a `remove()` method:

```javascript
return {
  remove,
};
```

### **Verification**
After the fix, both methods now return consistent listener objects that can be used to remove event listeners.

---

## Bug #2: Logic Error in `waterfallEmit()` method

### **Problem Description**
The `waterfallEmit()` method had a critical flaw where it would overwrite the data being passed between listeners when a listener function returned `undefined` (which is the default return value for functions without explicit return statements). This broke the waterfall chain and caused subsequent listeners to receive `undefined` instead of the intended data.

### **Location**:
- `index.cjs` lines 92-102  
- `index.mjs` lines 92-102

### **Impact**
- **Severity**: High
- **Type**: Logic Error
- Waterfall event chains would break when listeners didn't explicitly return values
- Data loss in event processing pipelines
- Unpredictable behavior for users who weren't aware of the implicit return requirement

### **Root Cause**
The code unconditionally assigned the result of each listener function to the `data` variable, without checking if the function actually returned a meaningful value.

### **Fix Applied**
Modified the logic to only update the data when the listener returns a non-undefined value:

```javascript
const result = events[i].fn(data, () => {
  isEnd = true;
});
if (isEnd) {
  break;
}
// Only update data if the listener returned a non-undefined value
if (result !== undefined) {
  data = result;
}
```

### **Verification**
Now listeners that don't explicitly return values won't break the waterfall chain, and the original data will be preserved for subsequent listeners.

---

## Bug #3: Security/Input Validation Issue

### **Problem Description**
Both `addEventListener()` and `once()` methods lacked input validation, accepting any type of parameters without verification. This could lead to runtime errors when:
- `name` parameter is not a string (e.g., `null`, `undefined`, `number`)
- `fn` parameter is not a function (e.g., `null`, `undefined`, `string`, `object`)

### **Location**:
- `index.cjs` lines 25-35 (addEventListener) and 46-65 (once)
- `index.mjs` lines 25-35 (addEventListener) and 46-65 (once)

### **Impact**
- **Severity**: Medium-High
- **Type**: Security/Input Validation Issue
- Runtime errors when events are triggered with invalid listeners
- Potential crashes in production applications
- Poor developer experience with unclear error messages
- Security risk if untrusted input is passed to these methods

### **Root Cause**
No input validation was performed on method parameters, allowing invalid data to be stored in the events array.

### **Fix Applied**
Added comprehensive input validation at the beginning of both methods:

```javascript
if (typeof name !== 'string' || name.trim() === '') {
  throw new Error('Event name must be a non-empty string');
}
if (typeof fn !== 'function') {
  throw new Error('Event listener must be a function');
}
```

### **Verification**
Now both methods will throw clear, descriptive errors when called with invalid parameters, preventing runtime issues and improving the developer experience.

---

## Summary of Changes

### Files Modified:
- `index.cjs` - Fixed all 3 bugs
- `index.mjs` - Fixed all 3 bugs

### Impact Assessment:
- **Bug #1**: Fixes API consistency and prevents runtime errors
- **Bug #2**: Ensures reliable waterfall event processing
- **Bug #3**: Improves security and prevents crashes from invalid input

### Backward Compatibility:
- All fixes maintain backward compatibility for valid usage
- Only invalid usage patterns (which were already broken) will now throw errors
- No breaking changes for existing correct implementations

These fixes significantly improve the reliability, security, and usability of the yum-event-center library while maintaining full backward compatibility for valid use cases.