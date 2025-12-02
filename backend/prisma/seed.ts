import prisma from '../src/prismaClient';

async function main() {
  await prisma.product.createMany({
    data: [
      { sku: 'STL-001', name: 'Steel Rod 12mm', description: 'High tensile steel rod', price: '12.50', stock: 100 },
      { sku: 'STL-002', name: 'Steel Sheet 2mm', description: 'Galvanized sheet', price: '45.00', stock: 50 }
    ],
    skipDuplicates: true
  });
  console.log('Seed done');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
