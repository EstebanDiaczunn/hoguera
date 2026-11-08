// Simula el módulo cloudflare:workers para correr las pruebas en Node.
import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(s, c, n) { return s === 'cloudflare:workers' ? { url: 'data:text/javascript,export class DurableObject {}', shortCircuit: true } : n(s, c); }`));
