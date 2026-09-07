import { createFileRoute } from '@tanstack/react-router';
import { BlockCatalog } from '../components/block-pages';

export const Route = createFileRoute('/blocks/')({ component: BlockCatalog });
