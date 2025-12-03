// prisma/seed.ts
import prisma from '../src/prismaClient';

async function main() {

  // Hapus data lama (opsional, tapi aman untuk dev)
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        sku: 'STL-ROD-12MM',
        name: 'Steel Rod 12mm',
        description: 'High tensile steel rod suitable for heavy construction and industrial frameworks.',
        price: '13.00',
        stock: 120,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMhelnovNPAaEQn1bUzI-pZkKLC6n1EY1l6g&s'
      },

      {
        sku: 'STL-SHEET-2MM',
        name: 'Steel Sheet 2mm',
        description: 'Galvanized steel sheet with corrosion resistance ideal for fabrication and paneling.',
        price: '45.00',
        stock: 80,
        image: 'https://5.imimg.com/data5/SELLER/Default/2021/9/GS/CW/VT/61869393/2mm-stainless-steel-sheet.jpg'
      },

      {
        sku: 'STL-PIPE-1IN',
        name: 'Steel Pipe 1 Inch',
        description: 'Seamless round steel pipe used for mechanical and structural applications.',
        price: '32.00',
        stock: 60,
        image: 'https://5.imimg.com/data5/SELLER/Default/2024/8/446202095/HO/ZF/SO/78915834/round-ss-pipe-500x500.jpeg'
      },

      {
        sku: 'STL-HBEAM-150',
        name: 'H-Beam 150mm',
        description: 'Strong H-beam profile perfect for building frameworks and heavy support structures.',
        price: '120.00',
        stock: 40,
        image: 'https://image.made-in-china.com/318f0j00ntkRjcrJEVqW/H-Beam5-mp4.webp'
      },

      {
        sku: 'STL-PLATE-10MM',
        name: 'Steel Plate 10mm',
        description: 'Thick steel plate for heavy equipment fabrication, machine bases, and industrial components.',
        price: '95.00',
        stock: 50,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROk_Q63IDmYZvwswcDkmLYZOm52PwLvwlIMw&s'
      },

      {
        sku: 'STL-WIRE-COIL',
        name: 'Steel Wire Coil',
        description: 'Industrial-grade cold drawn steel wire coil ideal for binding, fabrication, and reinforcement.',
        price: '18.00',
        stock: 100,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReg6-NdXIWxEw4I1h8gYPtkfZ6SMZbxCqf5A&s'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seed selesai — 6 produk ditambahkan.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
