# Component Package Template - Framtidsbygget

**Version:** 1.0  
**Purpose:** Standardized template for consistent AI-friendly component packages  
**Usage:** Copy this template when creating any new component package

---

## Package: [COMPONENT_NAME]

### Package Metadata
```yaml
package_id: [UNIQUE_ID e.g., F1, G2, etc.]
package_name: [DESCRIPTIVE_NAME]
package_type: [system|framework|game|support]
version: 1.0
token_count: [ESTIMATED_TOKENS]
complexity: [low|medium|high|very_high]
ai_success_rate: [X/10]
```

### Package Summary
**Purpose:** [One sentence describing what this package delivers]  
**Target Output:** [Specific files/components that will be created]  
**Development Time:** [Estimated hours/days]

---

## 📁 Package Contents

### Core Specifications
```
/specs
  - [UX_UI_Spec_X_X.md] (X tokens) - UI/UX specification
  - [GDD_Game_Name.md] (X tokens) - Game design document (if applicable)
  - [Technical_Spec.md] (X tokens) - Technical requirements
```

### Implementation Guides
```
/guides
  - [Component_Implementation_Guide.md] (X tokens)
  - [Integration_Patterns.md] (X tokens)
  - [Testing_Strategy.md] (X tokens)
```

### Reference Code
```
/reference
  - [example_implementation.js] (X tokens)
  - [css_styles.css] (X tokens)
  - [test_examples.test.js] (X tokens)
```

### Supporting Documents
```
/support
  - [Common_Pitfalls.md] (X tokens)
  - [Performance_Optimization.md] (X tokens)
  - [Accessibility_Checklist.md] (X tokens)
```

**Total Package Size:** [SUM] tokens

---

## 🔗 Dependencies

### Required Packages
```yaml
dependencies:
  - S1: Project Foundation (always required)
  - [PACKAGE_ID]: [Package Name] - [Why needed]
  - [PACKAGE_ID]: [Package Name] - [Why needed]
```

### Optional Enhancements
```yaml
optional:
  - [PACKAGE_ID]: [Package Name] - [When to include]
  - X1: Testing & Quality - [For comprehensive testing]
```

### Dependency Load Order
```
1. Load S1 (Project Foundation)
2. Load [DEPENDENCY_1]
3. Load [DEPENDENCY_2]
4. Load this package
```

---

## 🎯 Implementation Workflow

### Phase 1: Setup & Structure
```markdown
## Tasks
- [ ] Create component file structure
- [ ] Set up development environment
- [ ] Import required dependencies
- [ ] Initialize component skeleton

## Deliverables
- Basic component file ([ComponentName].jsx)
- CSS module ([ComponentName].module.css)
- Test file ([ComponentName].test.js)

## Time Estimate: [X hours]
```

### Phase 2: Core Implementation
```markdown
## Tasks
- [ ] Implement main component logic
- [ ] Add state management
- [ ] Create sub-components
- [ ] Apply styling

## Deliverables
- Functional component with all features
- Proper prop handling
- State management implementation
- Styled according to design system

## Time Estimate: [X hours]
```

### Phase 3: Integration & Polish
```markdown
## Tasks
- [ ] Integrate with parent components
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Performance optimization

## Deliverables
- Fully integrated component
- Error boundaries
- Loading/empty states
- Optimized performance

## Time Estimate: [X hours]
```

### Phase 4: Testing & Validation
```markdown
## Tasks
- [ ] Write unit tests
- [ ] Create integration tests
- [ ] Test accessibility
- [ ] Performance validation

## Deliverables
- >90% test coverage
- All tests passing
- Accessibility compliance
- Performance benchmarks met

## Time Estimate: [X hours]
```

---

## 📋 Component Specification

### Props Interface
```typescript
interface [ComponentName]Props {
  // Required props
  [propName]: [type]; // [Description]
  
  // Optional props
  [propName]?: [type]; // [Description]
  
  // Callbacks
  [onEventName]: (param: [type]) => void; // [When triggered]
}
```

### State Structure
```typescript
interface [ComponentName]State {
  // Local state
  [stateName]: [type]; // [Purpose]
  
  // Derived state
  [computed]: [type]; // [How calculated]
}
```

### Component API
```javascript
// Public methods (if any)
componentRef.current = {
  [methodName]: (params) => { /* description */ },
  [methodName]: (params) => { /* description */ }
};
```

---

## ✅ Success Criteria

### Functional Requirements
- [ ] All UI elements render correctly
- [ ] User interactions work as specified
- [ ] State updates trigger appropriate re-renders
- [ ] Data flows correctly to/from parent
- [ ] Error states handled gracefully

### Technical Requirements
- [ ] TypeScript/PropTypes validation complete
- [ ] No console errors or warnings
- [ ] Memory leaks prevented
- [ ] Event listeners cleaned up
- [ ] Accessibility standards met (WCAG 2.1 AA)

### Performance Targets
- [ ] Initial render: <[X]ms
- [ ] Re-render: <[X]ms
- [ ] Bundle size: <[X]KB
- [ ] Memory usage: <[X]MB
- [ ] 60fps during animations

### Quality Gates
- [ ] Code review passed
- [ ] Unit test coverage >90%
- [ ] Integration tests passing
- [ ] Storybook story created
- [ ] Documentation complete

---

## 🐛 Common Issues & Solutions

### Issue 1: [Common Problem]
**Symptom:** [What goes wrong]  
**Cause:** [Why it happens]  
**Solution:** [How to fix]
```javascript
// Example fix code
```

### Issue 2: [Common Problem]
**Symptom:** [What goes wrong]  
**Cause:** [Why it happens]  
**Solution:** [How to fix]

---

## 📚 AI Implementation Guide

### Optimal Context Loading
```yaml
# For basic implementation
contexts:
  - S1: Project Foundation
  - S2: Design System Core (if UI component)
  - This package

# For complex implementation  
contexts:
  - S1: Project Foundation
  - [Required dependencies]
  - This package
  - X1: Testing & Quality
```

### AI Prompt Template
```markdown
I need to implement [ComponentName] for the Framtidsbygget project.

Package Contents:
- [List key files from this package]

Requirements:
- [Key requirement 1]
- [Key requirement 2]
- [Key requirement 3]

Please implement the component following the specifications in the package.
```

### Step-by-Step AI Workflow
1. **Load context:** Include S1 + dependencies + this package
2. **Request structure:** Ask AI to create file structure first
3. **Implement core:** Build main component functionality
4. **Add features:** Incrementally add complex features
5. **Test & refine:** Validate against success criteria

---

## 🔍 Validation Checklist

### Pre-Implementation Review
- [ ] All dependencies available
- [ ] Specifications clear and complete
- [ ] Design assets provided
- [ ] API contracts defined
- [ ] Test criteria established

### Post-Implementation Review
- [ ] All success criteria met
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Tests comprehensive
- [ ] Performance acceptable

### Integration Validation
- [ ] Works with parent components
- [ ] State management correct
- [ ] No breaking changes
- [ ] Backwards compatible
- [ ] Error handling robust

---

## 📈 Metrics & Monitoring

### Development Metrics
- **Estimated Time:** [X hours]
- **Actual Time:** [Track here]
- **Complexity Score:** [1-10]
- **Issues Encountered:** [Count]
- **AI Success Rate:** [%]

### Quality Metrics
- **Test Coverage:** [%]
- **Performance Score:** [1-100]
- **Accessibility Score:** [1-100]
- **Code Quality:** [A-F]
- **Documentation Completeness:** [%]

---

## 🚀 Quick Start Commands

```bash
# Create component structure
mkdir -p src/components/[ComponentName]
touch src/components/[ComponentName]/[ComponentName].jsx
touch src/components/[ComponentName]/[ComponentName].module.css
touch src/components/[ComponentName]/[ComponentName].test.js
touch src/components/[ComponentName]/index.js

# Install specific dependencies (if any)
npm install [required-packages]

# Run tests
npm test [ComponentName]

# Start Storybook
npm run storybook
```

---

## 📝 Notes & Considerations

### Special Requirements
[Any unique requirements or constraints for this component]

### Performance Considerations
[Specific performance concerns or optimizations needed]

### Accessibility Focus
[Key accessibility features to implement]

### Mobile Considerations
[Specific mobile/responsive requirements]

---

## 🔄 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [DATE] | Initial package creation | [AI/Developer] |

---

*This package follows the Framtidsbygget Component Package Standard v1.0*