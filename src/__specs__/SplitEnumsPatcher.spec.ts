import fs from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SplitEnumsPatcher } from '../SplitEnumsPatcher';

describe('SplitEnumsPatcher', () => {
	const outputDir = 'src/__specs__/__generated__';
	const indexFile = `${outputDir}/index.ts`;
	const enumsFile = `${outputDir}/enums.ts`;
	const operationsFile = `${outputDir}/operations.ts`;

	beforeEach(() => {
		fs.writeFileSync(indexFile, '', 'utf-8');
		fs.writeFileSync(enumsFile, '', 'utf-8');
		fs.writeFileSync(operationsFile, '', 'utf-8');
	});

	it('should provide file paths', () => {
		const patcher = new SplitEnumsPatcher({
			outputDir,
		});

		const filePaths = patcher.getFilePaths();

		expect(filePaths).toEqual({
			operations: operationsFile,
			enums: enumsFile,
			index: indexFile,
		});
	});

	it('should write index file as a result of `afterAllFileWrite` hook', () => {
		if (fs.existsSync(indexFile)) {
			fs.unlinkSync(indexFile);
		}

		const patcher = new SplitEnumsPatcher({
			outputDir,
		});
		patcher.afterAllFileWriteHook();

		expect(fs.existsSync(indexFile)).toBe(true);
		expect(fs.readFileSync(indexFile, 'utf-8').trim()).toBe(
			"export * from './enums';\nexport * from './operations';"
		);
	});

	it('should rewrite enums file during `afterAllFileWrite` hook', () => {
		fs.writeFileSync(
			enumsFile,
			`
export enum Unused {
  Bar = 'BAR',
  Foo = 'FOO'
}

export type FindUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}


export type FindUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, username: string, role: Role } | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, username: string, role: Role };
`,
			'utf-8'
		);

		const patcher = new SplitEnumsPatcher({
			outputDir,
		});
		patcher.afterAllFileWriteHook();

		expect(fs.readFileSync(enumsFile, 'utf-8').trim())
			.toBe(`export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum Unused {
  Bar = 'BAR',
  Foo = 'FOO'
}`);
	});
});
