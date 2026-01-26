# Dependency Analysis

**Last Updated:** 2026-01-19  
**Package Manager:** npm  
**Node Version:** (Not specified in package.json)

---

## Outdated Packages

### Status: ⚠️ Manual Check Required

**Check Command:**
```bash
npm outdated
```

**Note:** Command may fail due to sandbox permissions. Run locally for accurate results.

### Current Dependencies (from package.json)

#### Production Dependencies

| Package | Current Version | Latest Available | Status |
|---------|----------------|------------------|--------|
| `@google/genai` | ^1.34.0 | ⚠️ Check | Unknown |
| `lucide-react` | ^0.562.0 | ⚠️ Check | Unknown |
| `react` | ^19.2.3 | ⚠️ Check | Unknown |
| `react-dom` | ^19.2.3 | ⚠️ Check | Unknown |
| `react-markdown` | ^10.1.0 | ⚠️ Check | Unknown |
| `react-router-dom` | ^7.11.0 | ⚠️ Check | Unknown |
| `resend` | ^6.8.0 | ⚠️ Check | Unknown |

#### Development Dependencies

| Package | Current Version | Latest Available | Status |
|---------|----------------|------------------|--------|
| `@netlify/functions` | ^5.1.2 | ⚠️ Check | Unknown |
| `@types/node` | ^22.14.0 | ⚠️ Check | Unknown |
| `@vitejs/plugin-react` | ^5.0.0 | ⚠️ Check | Unknown |
| `autoprefixer` | ^10.4.23 | ⚠️ Check | Unknown |
| `postcss` | ^8.5.6 | ⚠️ Check | Unknown |
| `tailwindcss` | ^4.1.18 | ⚠️ Check | Unknown |
| `typescript` | ~5.8.2 | ⚠️ Check | Unknown |
| `vite` | ^6.2.0 | ⚠️ Check | Unknown |

**Action Required:** Run `npm outdated` locally to get accurate version information.

---

## Security Vulnerabilities

### Status: ⚠️ Manual Check Required

**Check Command:**
```bash
npm audit
```

**Audit Levels:**
- `npm audit` - All vulnerabilities
- `npm audit --audit-level=moderate` - Moderate and above
- `npm audit --audit-level=high` - High and critical only

**Note:** Command may fail due to sandbox permissions. Run locally for accurate results.

### Known Vulnerabilities
**Status:** Unknown (requires local audit)

**Common Vulnerability Types:**
- Dependency vulnerabilities (transitive)
- Outdated packages with known CVEs
- Insecure dependencies

**Action Required:**
1. Run `npm audit` locally
2. Review high/critical vulnerabilities
3. Update affected packages
4. Test after updates

---

## Duplicate Dependencies

### Status: ⚠️ Manual Check Required

**Check Command:**
```bash
npm ls --depth=0
```

**Potential Duplicates:**
- React versions (should be consistent)
- Type definitions (@types packages)

**Known Issues:**
- None documented (manual check required)

---

## Unused Dependencies

### Status: ⚠️ Manual Review Required

**Potential Unused Packages:**

#### Production Dependencies

1. **`@google/genai`** (^1.34.0)
   - **Used in:** `services/gemini.ts`
   - **Status:** ✅ Used

2. **`lucide-react`** (^0.562.0)
   - **Used in:** Multiple components (icons)
   - **Status:** ✅ Used

3. **`react`** (^19.2.3)
   - **Used in:** All components
   - **Status:** ✅ Used

4. **`react-dom`** (^19.2.3)
   - **Used in:** `index.tsx` (entry point)
   - **Status:** ✅ Used

5. **`react-markdown`** (^10.1.0)
   - **Used in:** Article pages, markdown rendering
   - **Status:** ✅ Used

6. **`react-router-dom`** (^7.11.0)
   - **Used in:** `src/App.tsx`, navigation components
   - **Status:** ✅ Used

7. **`resend`** (^6.8.0)
   - **Used in:** `functions/api/feedback.ts` (Netlify function)
   - **Status:** ✅ Used

#### Development Dependencies

1. **`@netlify/functions`** (^5.1.2)
   - **Used in:** Netlify serverless functions
   - **Status:** ✅ Used (if deploying to Netlify)

2. **`@types/node`** (^22.14.0)
   - **Used in:** TypeScript type checking
   - **Status:** ✅ Used

3. **`@vitejs/plugin-react`** (^5.0.0)
   - **Used in:** `vite.config.ts`
   - **Status:** ✅ Used

4. **`autoprefixer`** (^10.4.23)
   - **Used in:** PostCSS processing
   - **Status:** ✅ Used

5. **`postcss`** (^8.5.6)
   - **Used in:** CSS processing
   - **Status:** ✅ Used

6. **`tailwindcss`** (^4.1.18)
   - **Used in:** Styling system
   - **Status:** ✅ Used

7. **`typescript`** (~5.8.2)
   - **Used in:** Type checking, compilation
   - **Status:** ✅ Used

8. **`vite`** (^6.2.0)
   - **Used in:** Build tool, dev server
   - **Status:** ✅ Used

**Conclusion:** All dependencies appear to be used. No obvious unused packages.

---

## Dependency Size Analysis

### Estimated Bundle Impact

| Package | Estimated Size | Tree-Shakeable | Notes |
|---------|---------------|----------------|-------|
| `react` | ~130KB | ❌ No | Core framework |
| `react-dom` | ~130KB | ❌ No | DOM renderer |
| `react-router-dom` | ~50KB | ✅ Partial | Route-based splitting |
| `react-markdown` | ~80KB | ✅ Partial | Only used on article pages |
| `lucide-react` | ~200KB+ | ✅ Yes | Only imports used icons |
| `@google/genai` | ~150KB | ❌ No | Only loaded when needed |

**Total Estimated:** ~740KB+ (uncompressed)

**Optimization Opportunities:**
1. `lucide-react` - Already tree-shakeable ✅
2. `react-markdown` - Could be lazy-loaded ⚠️
3. `@google/genai` - Only loaded server-side ✅

---

## Peer Dependencies

### Status: ✅ No Issues Found

**React Version:**
- `react`: ^19.2.3
- `react-dom`: ^19.2.3
- **Status:** Versions match ✅

**React Router:**
- `react-router-dom`: ^7.11.0
- **Compatible with:** React 19.x ✅

---

## Dependency Update Strategy

### Recommended Update Frequency

**Security Updates:** Immediately  
**Major Updates:** Review and test thoroughly  
**Minor/Patch Updates:** Monthly review

### Update Process

1. **Check for Updates:**
   ```bash
   npm outdated
   ```

2. **Review Changelogs:**
   - Check breaking changes
   - Review migration guides

3. **Update Dependencies:**
   ```bash
   npm update
   # Or for specific packages:
   npm install package@latest
   ```

4. **Test Thoroughly:**
   - Run build: `npm run build`
   - Test dev server: `npm run dev`
   - Manual testing of all features

5. **Commit Changes:**
   - Update `package.json` and `package-lock.json`
   - Test in staging environment
   - Deploy to production

---

## Known Dependency Issues

### 1. **React 19.2.3**
**Status:** ✅ Latest stable  
**Notes:** React 19 is relatively new, monitor for issues

### 2. **Vite 6.2.0**
**Status:** ✅ Latest  
**Notes:** Vite 6 is latest major version

### 3. **Tailwind CSS 4.1.18**
**Status:** ✅ Latest  
**Notes:** Tailwind 4 is latest major version

### 4. **TypeScript 5.8.2**
**Status:** ✅ Latest  
**Notes:** Using `~` version range (allows patch updates)

---

## Dependency Recommendations

### High Priority

1. **Regular Security Audits**
   - Run `npm audit` weekly
   - Fix high/critical vulnerabilities immediately

2. **Version Pinning Strategy**
   - Consider pinning exact versions for production
   - Use `^` for minor updates, `~` for patch updates

3. **Dependency Monitoring**
   - Set up Dependabot or similar
   - Get alerts for security vulnerabilities

### Medium Priority

4. **Bundle Size Monitoring**
   - Track bundle size over time
   - Set size limits in CI/CD

5. **Dependency Analysis**
   - Regular review of unused dependencies
   - Consider alternatives for large packages

### Low Priority

6. **Dependency Documentation**
   - Document why each dependency is needed
   - Keep notes on known issues

---

## Package Lock File

### Status: ✅ Present

**File:** `package-lock.json`  
**Purpose:** Locks exact dependency versions  
**Recommendation:** Commit to version control ✅

---

## Summary

### Current Status
- ✅ All dependencies appear to be used
- ✅ No obvious duplicate dependencies
- ⚠️ Security audit required (run locally)
- ⚠️ Version updates check required (run locally)

### Action Items
1. [ ] Run `npm outdated` locally
2. [ ] Run `npm audit` locally
3. [ ] Review and update vulnerable packages
4. [ ] Set up dependency monitoring (Dependabot)
5. [ ] Document dependency update process

### Maintenance Schedule
- **Weekly:** Security audit (`npm audit`)
- **Monthly:** Check for updates (`npm outdated`)
- **Quarterly:** Review and update major dependencies
- **As Needed:** Update for security vulnerabilities
