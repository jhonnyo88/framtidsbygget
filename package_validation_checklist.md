# Package Validation Checklist

**Purpose:** Ensure all packages meet AI development requirements  
**Version:** 1.0  
**Last Updated:** 2025-01-20

---

## 🎯 Overview

This checklist validates that each package in the Framtidsbygget repository is optimized for AI-assisted development. All packages must pass these quality gates before being considered complete.

---

## ✅ Completeness Criteria

### 1. Structure Requirements

Each package MUST contain:

- [ ] **index.md** - Package overview with Quick Start
- [ ] **Token count** - Documented in index.md header
- [ ] **Package ID** - Unique identifier (e.g., DS-001, S1, G1)
- [ ] **Status** - Complete/In Progress/Planned

### 2. Documentation Components

#### Minimum Required Files:
- [ ] `/index.md` - Package overview (2-3k tokens)
- [ ] At least one `/specs/` document
- [ ] At least one `/guides/` document  
- [ ] Reference implementation code

#### Component Packages (DS-*):
- [ ] Design specification
- [ ] Usage examples from real contexts
- [ ] Implementation guide
- [ ] Complete reference code (JSX + CSS)

#### System Packages (S*):
- [ ] Architecture documentation
- [ ] Implementation patterns
- [ ] Integration guides
- [ ] Best practices

#### Game Packages (G*):
- [ ] Game design documentation
- [ ] Component specifications
- [ ] State management patterns
- [ ] Asset requirements

### 3. Content Requirements

- [ ] **Quick Start** - Copy-paste ready examples
- [ ] **Dependencies** - Internal and external clearly listed
- [ ] **API Documentation** - Props, methods, hooks
- [ ] **Related Packages** - Cross-references to dependencies

---

## 📏 Token Size Validation

### Size Limits

| Package Type | Target Size | Maximum Size | Critical Threshold |
|--------------|-------------|--------------|-------------------|
| Component (DS) | 8-10k | 15k | 20k |
| System (S) | 20-25k | 30k | 35k |
| Framework (F) | 20-25k | 30k | 35k |
| Game (G) | 25-28k | 35k | 40k |

### Token Counting Method

```bash
# Count tokens in a package
find ./PackageName -name "*.md" -o -name "*.jsx" -o -name "*.js" -o -name "*.css" | \
xargs wc -w | tail -1

# Rough estimate: 1 token ≈ 0.75 words
```

### Size Optimization Checklist

- [ ] Remove redundant examples
- [ ] Extract large code blocks to separate files
- [ ] Use references instead of duplication
- [ ] Split oversized packages into sub-packages

---

## 🤖 AI Compatibility Checks

### 1. Context Independence

Each package must be understandable in isolation:

- [ ] **No external references** without explanation
- [ ] **Self-contained examples** that work standalone
- [ ] **Clear dependency declarations** at package level
- [ ] **Complete import statements** in all code examples

### 2. Code Completeness

All code examples must be:

- [ ] **Fully functional** - No pseudo-code unless marked
- [ ] **Import complete** - All imports shown
- [ ] **Error-free** - Valid syntax
- [ ] **Runnable** - Can be copy-pasted and used

### 3. Navigation Aids

For AI navigation:

- [ ] **Clear section headers** with descriptive names
- [ ] **Consistent structure** across similar packages
- [ ] **Cross-references** use Package IDs
- [ ] **File paths** are absolute from package root

### 4. Example Quality

```jsx
// ❌ Bad - Missing imports, incomplete
const MyComponent = () => {
  return <Button>Click</Button>;
};

// ✅ Good - Complete and runnable
import React from 'react';
import Button from '@/components/common/Button';

const MyComponent = () => {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked')}>
      Click me
    </Button>
  );
};
```

---

## 🏆 Quality Gates

### Gate 1: Structural Completeness (Mandatory)

**Pass Criteria:**
- All required files present
- Correct folder structure
- Package ID assigned
- Token count documented

**Validation Command:**
```bash
# Check structure
ls -la PackageName/
ls -la PackageName/specs/
ls -la PackageName/guides/
ls -la PackageName/reference/
```

### Gate 2: Size Compliance (Mandatory)

**Pass Criteria:**
- Within token limits for package type
- No single file exceeds 5k tokens
- Total package under maximum threshold

**Validation:**
- Manual token count
- Verify against limits table
- Document in index.md

### Gate 3: AI Usability (Mandatory)

**Pass Criteria:**
- Quick Start section works in isolation
- All code examples are complete
- Dependencies clearly documented
- Cross-references use Package IDs

**Test Method:**
1. Open only the package in AI context
2. Try to implement Quick Start example
3. Verify no missing information

### Gate 4: Content Quality (Recommended)

**Pass Criteria:**
- Swedish content properly spelled
- Code follows project conventions
- Consistent formatting
- Practical, real-world examples

---

## 📋 Validation Process

### For New Packages

1. **Create Package Structure**
   ```bash
   mkdir -p PackageName/{specs,guides,reference}
   touch PackageName/index.md
   ```

2. **Develop Content**
   - Follow package template
   - Keep token count in mind
   - Test examples

3. **Run Validation**
   - Use this checklist
   - Count tokens
   - Test AI compatibility

4. **Document Results**
   ```markdown
   **Token Count:** ~X,XXX tokens
   **Validation:** ✅ Passed all gates
   **Date:** YYYY-MM-DD
   ```

### For Existing Packages

1. **Audit Current State**
   - Check against checklist
   - Identify gaps
   - Count current tokens

2. **Remediate Issues**
   - Add missing documentation
   - Optimize oversized content
   - Fix incomplete examples

3. **Re-validate**
   - Run through all gates
   - Update package metadata
   - Document improvements

---

## 🔍 Common Issues & Solutions

### Issue: Package Too Large

**Solutions:**
1. Split into multiple packages
2. Move detailed examples to separate package
3. Use more concise documentation
4. Reference shared content

### Issue: Incomplete Examples

**Solutions:**
1. Add all imports
2. Include required setup code
3. Provide working defaults
4. Test in isolation

### Issue: Missing Dependencies

**Solutions:**
1. List in index.md dependencies section
2. Show installation commands
3. Link to dependency packages
4. Include version requirements

### Issue: Poor AI Navigation

**Solutions:**
1. Add Package ID prominently
2. Use consistent headings
3. Include summary sections
4. Cross-reference with IDs

---

## 📊 Quality Metrics

### Package Health Score

Calculate package health (0-100):

```
Health Score = (
  Structure Score (25%) +
  Size Score (25%) +
  Completeness Score (25%) +
  AI Compatibility Score (25%)
)
```

### Scoring Rubric

**Structure (25 points)**
- All folders present: 10 pts
- index.md exists: 10 pts
- Proper naming: 5 pts

**Size (25 points)**  
- Under target: 25 pts
- Under maximum: 15 pts
- Over maximum: 0 pts

**Completeness (25 points)**
- All required docs: 15 pts
- Working examples: 10 pts

**AI Compatibility (25 points)**
- Self-contained: 10 pts
- Complete code: 10 pts
- Good navigation: 5 pts

### Target Scores
- **Excellent**: 90-100
- **Good**: 75-89
- **Acceptable**: 60-74
- **Needs Work**: <60

---

## 🚀 Automation Opportunities

### Validation Script (Future)

```javascript
// package-validator.js concept
const validatePackage = async (packagePath) => {
  const results = {
    structure: checkStructure(packagePath),
    size: await countTokens(packagePath),
    completeness: checkCompleteness(packagePath),
    aiCompatibility: checkAICompatibility(packagePath)
  };
  
  return {
    score: calculateScore(results),
    issues: findIssues(results),
    passed: results.score >= 60
  };
};
```

### CI Integration
- Pre-commit hooks for validation
- Automated token counting
- Structure verification
- Example testing

---

## 📝 Validation Template

Copy this template for each package validation:

```markdown
## Package Validation: [Package Name]

**Package ID:** [ID]  
**Date:** [YYYY-MM-DD]  
**Validator:** [Name/AI]

### Completeness Criteria
- [ ] Structure Requirements
- [ ] Documentation Components  
- [ ] Content Requirements

### Token Size
- **Counted:** X,XXX tokens
- **Status:** ✅ Within limits / ⚠️ Near limit / ❌ Over limit

### AI Compatibility
- [ ] Context Independence
- [ ] Code Completeness
- [ ] Navigation Aids
- [ ] Example Quality

### Quality Gates
- Gate 1 (Structure): ✅ Pass / ❌ Fail
- Gate 2 (Size): ✅ Pass / ❌ Fail  
- Gate 3 (AI): ✅ Pass / ❌ Fail
- Gate 4 (Quality): ✅ Pass / ❌ Fail

### Overall Score: XX/100

### Issues Found:
1. [Issue description]
2. [Issue description]

### Remediation Actions:
1. [Action needed]
2. [Action needed]
```

---

## 🎯 Success Criteria

A package is considered **AI Development Ready** when:

1. ✅ Passes all mandatory quality gates
2. ✅ Token count within limits
3. ✅ Score of 75+ on health metrics
4. ✅ Successfully used by AI to implement features
5. ✅ No critical issues in validation

---

## 📚 Related Documents

- `package_taxonomy.md` - Package structure overview
- `component_package_template.md` - Package creation template
- `ai_navigation_guide.md` - AI usage patterns
- `documentation_index.md` - Complete documentation map