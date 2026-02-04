/**
 * JSON-LD structured data for SEO. Injected per-route to help Google understand
 * medical content and enable rich results (e.g. MedicalWebPage, SoftwareApplication).
 */

const BASE_URL = 'https://neurowiki.ai';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Neurowiki',
  description: 'The Digital Neurology Companion - protocols, calculators, and guidelines for neurologists and residents.',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
};

/** Schema for calculator pages: MedicalWebPage + SoftwareApplication */
function calculatorSchema(pathname: string, title: string, description: string, calculatorName: string): object {
  const url = `${BASE_URL}${pathname}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        name: title,
        description,
        url,
        audience: {
          '@type': 'MedicalAudience',
          audienceType: 'Physician, Neurologist, Emergency Medicine, Resident',
        },
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: calculatorName,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        lastReviewed: '2026-02-03',
      },
    ],
  };
}

/** Schema for guide/protocol pages */
function guideSchema(pathname: string, title: string, description: string): object {
  const url = `${BASE_URL}${pathname}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url,
    audience: { '@type': 'MedicalAudience', audienceType: 'Physician, Neurologist, Resident' },
    lastReviewed: '2026-02-03',
  };
}

/** Schema for trial pages */
function trialSchema(pathname: string, title: string, description: string): object {
  const url = `${BASE_URL}${pathname}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url,
    audience: { '@type': 'MedicalAudience', audienceType: 'Physician, Neurologist, Resident' },
    about: { '@type': 'MedicalScholarlyArticle', name: title },
    lastReviewed: '2026-02-03',
  };
}

/** Calculator display names for schema mainEntity */
const CALC_NAMES: Record<string, string> = {
  '/calculators/nihss': 'NIHSS Calculator',
  '/calculators/ich-score': 'ICH Score Calculator',
  '/calculators/abcd2-score': 'ABCD2 Score Calculator',
  '/calculators/has-bled-score': 'HAS-BLED Score Calculator',
  '/calculators/rope-score': 'RoPE Score Calculator',
  '/calculators/glasgow-coma-scale': 'Glasgow Coma Scale Calculator',
  '/calculators/heidelberg-bleeding-classification': 'Heidelberg Bleeding Classification',
  '/calculators/boston-criteria-caa': 'Boston Criteria 2.0 for CAA',
  '/calculators/evt-pathway': 'EVT Thrombectomy Pathway',
  '/calculators/elan-pathway': 'ELAN Post-Stroke Anticoagulation',
  '/calculators/se-pathway': 'Status Epilepticus Pathway',
  '/calculators/migraine-pathway': 'Migraine Pathway',
  '/calculators/gca-pathway': 'GCA Pathway',
};

/**
 * Returns JSON-LD object for the given pathname and meta. Used by Seo component to inject script.
 */
export function getSchemaForRoute(
  pathname: string,
  meta: { title: string; description: string }
): object | null {
  if (pathname === '/') {
    return ORGANIZATION_SCHEMA;
  }
  if (pathname.startsWith('/calculators/')) {
    const name = CALC_NAMES[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Calculator';
    return calculatorSchema(pathname, meta.title, meta.description, name);
  }
  if (pathname.startsWith('/guide/')) {
    return guideSchema(pathname, meta.title, meta.description);
  }
  if (pathname.startsWith('/trials/')) {
    return trialSchema(pathname, meta.title, meta.description);
  }
  return null;
}
