import { describe, expect, it } from 'vitest';
import { SplitEnumsPatcher } from '../SplitEnumsPatcher';

describe('SplitEnumsPatcher', () => {
	it('should provide file paths', () => {
		const configurator = new SplitEnumsPatcher({
			outputDir: 'output',
		});

		const filePaths = configurator.getFilePaths();

		expect(filePaths).toEqual({
			operations: 'output/operations.ts',
			enums: 'output/enums.ts',
			index: 'output/index.ts',
		});
	});
});
