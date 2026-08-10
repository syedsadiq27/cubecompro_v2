import type { ConfigurationState } from './configuration';

export type ValidationSeverity = 'block' | 'warning';

export type ValidationIssue = {
  id: string;
  severity: ValidationSeverity;
  message: string;
};

export type ValidationRule = {
  id: string;
  evaluate: (state: ConfigurationState) => ValidationIssue | null;
};

export type ValidationResult = {
  issues: ValidationIssue[];
  canProceed: boolean;
  canAddToCart: boolean;
};

export function createValidationRegistry(rules: ValidationRule[]) {
  return {
    evaluate(state: ConfigurationState): ValidationResult {
      const issues = rules
        .map((rule) => rule.evaluate(state))
        .filter((issue): issue is ValidationIssue => Boolean(issue));
      const hasBlock = issues.some((issue) => issue.severity === 'block');
      return {
        issues,
        canProceed: !hasBlock,
        canAddToCart: !hasBlock,
      };
    },
  };
}

export const defaultValidationRules: ValidationRule[] = [
  {
    id: 'colorway-or-parts-required',
    evaluate: (state) => {
      if (state.activeStep === 'product') return null;
      if (state.colorway || state.partColors.length > 0) return null;
      if (state.activeStep === 'color') return null;
      return {
        id: 'colorway-or-parts-required',
        severity: 'warning',
        message: 'No colorway selected yet — you can continue or customize parts.',
      };
    },
  },
  {
    id: 'decoration-logo-resolution',
    evaluate: (state) => {
      const hasLogo = state.decorations.some((entry) => entry.logoName);
      if (!hasLogo) return null;
      return {
        id: 'decoration-logo-resolution',
        severity: 'warning',
        message: 'Logo resolution may be too low for embroidery.',
      };
    },
  },
];
