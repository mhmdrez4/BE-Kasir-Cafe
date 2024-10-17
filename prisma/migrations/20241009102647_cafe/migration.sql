-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
