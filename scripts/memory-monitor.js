#!/usr/bin/env node

// Memory monitoring script for development
const used = process.memoryUsage();

console.log('Memory Usage:');
console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`);
console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`);
console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
console.log(`  External: ${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`);

// Check if memory usage is high
const heapUsedMB = used.heapUsed / 1024 / 1024;
if (heapUsedMB > 400) {
  console.warn('⚠️  High memory usage detected! Consider optimizing your application.');
}

// Log garbage collection info
if (global.gc) {
  global.gc();
  console.log('🔄 Garbage collection triggered');
} 