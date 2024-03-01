// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
//
// async function main() {
//     let colourThresholdConfig = await prisma.threshold.findFirst({
//         where: { name: 'COLOUR' },
//     });
//     if (!colourThresholdConfig) {
//         colourThresholdConfig = await prisma.threshold.create({
//             data: {
//                 name: 'COLOUR',
//                 config: {
//                     desvio_color: {
//                         excelent: 28,
//                         deficient: 40,
//                     },
//                     desvio_grises: {
//                         excelent: 10,
//                         deficient: 40,
//                     },
//                 },
//             },
//         });
//     }
//
//     let lowLightNoiseThresholdConfig = await prisma.threshold.findFirst({
//         where: { name: 'LOW_LIGHT_NOISE' },
//     });
//     if (!lowLightNoiseThresholdConfig) {
//         lowLightNoiseThresholdConfig = await prisma.threshold.create({
//             data: {
//                 name: 'LOW_LIGHT_NOISE',
//                 config: {
//                     snr: {
//                         excelent: 9,
//                         deficient: 4,
//                     },
//                     luminancia: {
//                         excelent: 120,
//                         deficient: 60,
//                     },
//                     nivel_de_ruido: {
//                         excelent: 30,
//                         deficient: 70,
//                     },
//                 },
//             },
//         });
//     }
//
//     let resolutionThresholdConfig = await prisma.threshold.findFirst({
//         where: { name: 'RESOLUTION' },
//     });
//     if (!resolutionThresholdConfig) {
//         resolutionThresholdConfig = await prisma.threshold.create({
//             data: {
//                 name: 'RESOLUTION',
//                 config: {
//                     megapixeles_efectivos: {
//                         excelent: 0.7,
//                         deficient: 0.2,
//                     },
//                 },
//             },
//         });
//     }
//
//     console.log('Current threshold configs are: ', [
//         colourThresholdConfig,
//         lowLightNoiseThresholdConfig,
//         resolutionThresholdConfig,
//     ]);
// }
// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
