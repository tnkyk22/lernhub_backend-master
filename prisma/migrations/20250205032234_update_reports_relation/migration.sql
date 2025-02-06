-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `Reports_sheetId_fkey`;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_sheetId_fkey` FOREIGN KEY (`sheetId`) REFERENCES `Sheet`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
