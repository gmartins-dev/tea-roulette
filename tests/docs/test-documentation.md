# Drink Runner Roulette Testing Guide

## Overview
A guide to ensuring our drink runner application works reliably and efficiently for everyone.

## General Guide

### Features We Verify
1. **Team Member Management**
   - Adding colleagues to the system
   - Keeping information up to date
   - Preventing duplicate entries
   - Ensuring name accuracy

2. **Drink Preferences**
   - Recording favorite drinks
   - Customizing orders (milk, sugar, etc.)
   - Saving special instructions
   - Keeping track of who ordered what

3. **Round Organization**
   - Starting new drink rounds
   - Making sure there's enough people
   - Picking who makes the drinks
   - Managing everyone's orders

### How We Keep Things Running Smoothly
- Everything gets checked before updates
- Automatic safeguards prevent mistakes
- Regular system health checks
- Information accuracy verification

### Helpful Terms
- **Check**: Making sure something works as intended
- **Practice Run**: Testing without affecting real data
- **Information Check**: Making sure details are correct
- **System Talk**: How different parts work together

## Development Guide

### Quick Actions
```bash
npm run test          # Check everything
npm test specific-file # Check one thing
npm run test:coverage # See what's covered
```

### Common Examples

#### Adding People
```typescript
test('should add new colleague', async () => {
  const newColleague = {
    firstName: 'Jane',
    lastName: 'Smith'
  };
  // Implementation details
});
```

#### Managing Orders
```typescript
test('should handle drink request', async () => {
  const order = {
    userId: 'user-1',
    name: 'Earl Grey',
    type: 'Tea',
    extras: {
      milk: 'yes',
      sugar: '1'
    }
  };
  // Implementation details
});
```

### Important Requirements
- Names: Just letters and spaces, 2-50 characters
- Orders: Must include drink name and type
- Rounds: Need at least 2 people

## Helpful Solutions

### Getting Things Right
1. **Names**
   - ✅ Works: "Jane Smith"
   - ❌ Doesn't Work: "Jane123" or blank

2. **Orders**
   - ✅ Need: Drink name and type
   - ❌ Won't Work: Missing details

3. **Groups**
   - ✅ Good: 2 or more people
   - ❌ Not Possible: Just 1 person

## Quality Goals
- Thorough checking (80% coverage)
- Everything important is tested
- Problems are caught early
- Information is verified

## Getting Help
- Look at similar examples
- Ask for help when needed
- Report any issues
- Share what you learn

## Working Together

### Everyone's Part
- Regular checking
- Shared responsibility
- Speaking up about issues
- Following guidelines

### System Needs
- Proper preparation
- Practice runs
- Good timing
- Independent checks
