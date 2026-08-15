import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';
import {
  ApiMethod,
  ArchitectureDiagram,
  ChoiceExample,
  CommerceMapping,
  ConceptDiagram,
  Lifecycle,
  LifecycleStep,
  PropertyTable,
} from '@repo/docs-ui';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    ApiMethod,
    ArchitectureDiagram,
    ChoiceExample,
    CommerceMapping,
    ConceptDiagram,
    Lifecycle,
    LifecycleStep,
    PropertyTable,
    ...components,
  };
}
