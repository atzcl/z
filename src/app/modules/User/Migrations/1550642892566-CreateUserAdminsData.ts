import { MigrationInterface, QueryRunner } from 'typeorm';
import Helper from '@app/extend/helper';

/* eslint-disable */
export class CreateUserAdminsData1550642892566 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const username = 'atzcl';
		const password = Helper.createBcrypt('~!!~123');
		const name = 'atzcl';

		await queryRunner.query("INSERT INTO `user_admins`(`id`, `username`, `password`, `nickname`, `avatar`) VALUES ('77786bfc7a754a6aa7619c1681e1419c', '" + username + "', '" + password + "', '" + name + "', 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg');");
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query("DELETE FROM `user_admins`")
	}

}
