import { createFileRoute } from '@tanstack/react-router';

import { ComponentCatalog } from '../components/component-catalog';

export const Route = createFileRoute('/components/')({ component: ComponentCatalog });
