import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SplitEnumsPatcher } from '../SplitEnumsPatcher';

describe('SplitEnumsPatcher', () => {
	it('should provide file paths', () => {
		const patcher = new SplitEnumsPatcher({
			outputDir: 'output',
		});

		const filePaths = patcher.getFilePaths();

		expect(filePaths).toEqual({
			operations: 'output/operations.ts',
			enums: 'output/enums.ts',
			index: 'output/index.ts',
		});
	});

	it('should write index file as result of `afterAllFileWrite` hook', () => {
		const indexFile = 'src/__specs__/__generated__/index.ts';
		if (fs.existsSync(indexFile)) {
			fs.unlinkSync(indexFile);
		}

		const patcher = new SplitEnumsPatcher({
			outputDir: 'src/__specs__/__generated__',
		});

		patcher.afterAllFileWriteHook();

		expect(fs.existsSync(indexFile)).toBe(true);
		expect(fs.readFileSync(indexFile, 'utf-8').trim()).toBe(
			"export * from './enums';\nexport * from './operations';"
		);
	});
});
