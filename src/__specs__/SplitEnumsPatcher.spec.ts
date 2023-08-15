import fs from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SplitEnumsPatcher } from '../SplitEnumsPatcher';
import { fixtures } from './fixtures';

describe('SplitEnumsPatcher', () => {
	const outputDir = 'src/__specs__/__generated__';
	const indexFile = `${outputDir}/index.ts`;
	const enumsFile = `${outputDir}/enums.ts`;
	const operationsFile = `${outputDir}/operations.ts`;

	beforeEach(() => {
		fs.writeFileSync(indexFile, '', 'utf-8');
		fs.writeFileSync(operationsFile, '', 'utf-8');
		fs.writeFileSync(enumsFile, '', 'utf-8');
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

	fixtures.forEach(
		({
			name,
			operationSource,
			operationExpectedResult,
			enumsExpectedResult,
		}) => {
			describe(name, () => {
				it('should write index file during `afterAllFileWrite` hook', () => {
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

				it('should write enums file during `afterAllFileWrite` hook', () => {
					fs.writeFileSync(operationsFile, operationSource, 'utf-8');

					const patcher = new SplitEnumsPatcher({
						outputDir,
					});
					patcher.afterAllFileWriteHook();

					const result = fs.readFileSync(enumsFile, 'utf-8').trim();
					expect(result).toBe(enumsExpectedResult.trim());
				});

				it('should rewrite enums file during `afterAllFileWrite` hook', () => {
					fs.writeFileSync(operationsFile, operationSource, 'utf-8');

					const patcher = new SplitEnumsPatcher({
						outputDir,
					});
					patcher.afterAllFileWriteHook();

					const result = fs
						.readFileSync(operationsFile, 'utf-8')
						.trim();
					expect(result).toBe(operationExpectedResult.trim());
				});
			});
		}
	);
});
